import json
import re
import os
import hashlib
import asyncio
import concurrent.futures
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings
from app.core.cache import cache

def extract_json_from_text(text):
    """
    Helper to robustly find and parse JSON from LLM output, 
    even if it includes conversational filler or markdown.
    """
    try:
        # 1. Try direct parsing first
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Regex search for the first JSON object or list
    try:
        # Look for content between first { and last } OR first [ and last ]
        match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
        if match:
            clean_text = match.group(0)
            return json.loads(clean_text)
    except:
        pass
    
    return None

class AIEngine:
    def __init__(self):
        # Fast model for logic/extraction
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            google_api_key=settings.GOOGLE_API_KEY
        )
        # Grounded LLM for search (with Google Search Tool)
        self.llm_search = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.1,
            google_api_key=settings.GOOGLE_API_KEY
        ).bind(tools=[{"google_search": {}}])

    async def extract_characters(self, plot: str):
        """
        Extracts character data from the plot.
        Uses Redis caching to avoid re-processing the same plot script.
        """
        # 1. Check Cache
        plot_hash = hashlib.md5(plot.encode()).hexdigest()
        cache_key = f"chars:{plot_hash}"
        
        cached_data = await cache.get(cache_key)
        if cached_data:
            print(f"⚡ Cache Hit: Characters for plot {plot_hash}")
            return cached_data

        # 2. Run LLM if not in cache
        print(f"🧠 AI: Extracting characters for plot {plot_hash}...")
        prompt = ChatPromptTemplate.from_template(
            "Extract main characters from this plot. Return JSON with key 'characters' (list of {{name, gender, age_range, traits}}). "
            "Output ONLY raw JSON. Plot: {plot}"
        )
        chain = prompt | self.llm | StrOutputParser()
        try:
            res = await chain.ainvoke({"plot": plot})
            data = extract_json_from_text(res)
            
            # 3. Save to Cache (Expire in 24 hours)
            if data:
                await cache.set(cache_key, data, expire=86400)
                
            return data
        except Exception as e:
            print(f"❌ Error extracting characters: {e}")
            return None

    async def allocate_budget(self, characters, total_budget, currency_symbol):
        """
        Allocates the total budget across the identified characters.
        """
        char_names = [c['name'] for c in characters]
        prompt = ChatPromptTemplate.from_template(
            f"You are a Movie Producer. The Total Budget is {currency_symbol}{{total_budget}}. "
            f"Create a salary range (min and max) for these characters: {{char_names}} based on their importance. "
            "Return ONLY a JSON object: {{ 'allocations': [ {{ 'name': 'Exact Char Name', 'min_budget': float, 'max_budget': float }} ] }} "
        )
        chain = prompt | self.llm | StrOutputParser()
        try:
            res = await chain.ainvoke({"total_budget": total_budget, "char_names": str(char_names)})
            return extract_json_from_text(res)
        except Exception as e:
            print(f"❌ Error allocating budget: {e}")
            return None

    def fetch_actor_sync(self, char, context_str, currency_instruction):
        """
        Synchronous worker function to be run in a ThreadPool.
        Performs Google Search via Gemini to find matching actors.
        """
        prompt = ChatPromptTemplate.from_template(
            f"You are a Casting Director for a {context_str} movie. "
            f"Role: {{name}} (Gender: {{gender}}). Traits: {{traits}}. "
            f"**Target Salary Range:** {{min_b}} - {{max_b}}. "
            f"SEARCH and suggest exactly 5 {{gender}} actors whose market rate falls roughly within this range. "
            f"For each actor, find their estimated salary per film ({currency_instruction}) and recent box office average. "
            "\n\nRETURN ONLY A RAW JSON LIST of objects: "
            "[{{ 'name': 'Actor Name', 'salary': int (raw value), 'box_office': int (raw value), 'rating': float (1-10), 'versatility': int (1-100), 'risk': float (0.0-1.0) }}]"
        )
        chain = prompt | self.llm_search | StrOutputParser()
        try:
            res = chain.invoke({
                "name": char['name'],
                "gender": char.get('gender', 'Any'),
                "traits": char['traits'],
                "min_b": char.get('budget_min_display', 0),
                "max_b": char.get('budget_max_display', 0)
            })
            data = extract_json_from_text(res)
            return data if data else []
        except Exception as e:
            print(f"⚠️ Actor Search Failed for {char['name']}: {e}")
            return []

    async def run_pipeline(self, plot: str, budget: float, industry: str):
        """
        Orchestrates the entire extraction -> budgeting -> scouting flow.
        """
        # 1. Extract Characters (Cached)
        char_data = await self.extract_characters(plot)
        if not char_data or 'characters' not in char_data:
            raise ValueError("Failed to extract characters from plot.")
        
        characters = char_data['characters']
        
        # 2. Allocate Budget
        symbol = "₹" if industry == "Bollywood" else "$"
        alloc_data = await self.allocate_budget(characters, budget, symbol)
        
        allocations = alloc_data.get('allocations', []) if alloc_data else []
        
        # Merge Budget info into Character objects
        final_chars = []
        for char in characters:
            # Try to find matching allocation
            match = next((a for a in allocations if a['name'].lower() in char['name'].lower() or char['name'].lower() in a['name'].lower()), None)
            
            if match:
                char['budget_min_display'] = match['min_budget']
                char['budget_max_display'] = match['max_budget']
            else:
                # Fallback logic if AI missed a character
                avg = budget / len(characters)
                char['budget_min_display'] = avg * 0.5
                char['budget_max_display'] = avg * 1.5
            
            final_chars.append(char)
            
        # 3. Parallel Actor Search
        context_str = "Bollywood" if industry == "Bollywood" else "Hollywood"
        currency_inst = "in raw INR" if industry == "Bollywood" else "in raw USD"
        
        print(f"🚀 Starting parallel search for {len(final_chars)} roles...")
        
        # Get the current running event loop to schedule blocking tasks
        loop = asyncio.get_running_loop()
        futures = []
        
        # Schedule synchronous search tasks in a ThreadPoolExecutor
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            for char in final_chars:
                futures.append(
                    loop.run_in_executor(
                        pool, 
                        self.fetch_actor_sync, 
                        char, context_str, currency_inst
                    )
                )
            
            # Wait for all search tasks to complete
            results_lists = await asyncio.gather(*futures)
        
        # Attach results back to characters
        for i, actors in enumerate(results_lists):
            final_chars[i]['actors'] = actors
            
        return {"characters": final_chars}