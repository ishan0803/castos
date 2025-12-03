import numpy as np
import gymnasium as gym
from gymnasium import spaces
from stable_baselines3 import PPO

class CastingEnv(gym.Env):
    def __init__(self, data, budget_cap):
        super(CastingEnv, self).__init__()
        self.data = data
        self.num_characters = len(data['characters'])
        
        # Calculate max actors found for any role to set action space
        max_actors = 0
        for c in data['characters']:
            if len(c['actors']) > max_actors:
                max_actors = len(c['actors'])
        
        self.actors_per_char = max(max_actors, 1) # Prevent 0
        self.budget_cap = budget_cap 
        self.current_char_idx = 0
        self.selections = []

        # Action: Which actor index to pick for current character
        self.action_space = spaces.Discrete(self.actors_per_char)
        
        # Observation: Flattened attributes of available actors for current char
        # Size: actors_per_char * 5 features (salary, bo, rating, vers, risk)
        self.observation_space = spaces.Box(
            low=0, high=np.inf, 
            shape=(self.actors_per_char * 5,), 
            dtype=np.float64
        )

    def _get_obs(self):
        if self.current_char_idx >= self.num_characters:
            return np.zeros(self.observation_space.shape, dtype=np.float64)

        char_data = self.data['characters'][self.current_char_idx]
        actors = char_data['actors']
        
        obs = []
        for i in range(self.actors_per_char):
            if i < len(actors):
                a = actors[i]
                obs.extend([
                    a.get('salary', 0), 
                    a.get('box_office', 0), 
                    a.get('rating', 0), 
                    a.get('versatility', 0),
                    a.get('risk', 0)
                ])
            else:
                obs.extend([0, 0, 0, 0, 0]) 
        return np.array(obs, dtype=np.float64)

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_char_idx = 0
        self.selections = []
        return self._get_obs(), {}

    def step(self, action):
        current_char = self.data['characters'][self.current_char_idx]
        valid_actors = current_char['actors']
        
        if len(valid_actors) > 0:
            act_idx = int(action) if action < len(valid_actors) else 0
            selected_actor = valid_actors[act_idx]
        else:
            # Fallback placeholder
            selected_actor = {'salary': 0, 'box_office': 0, 'rating': 0, 'versatility': 0, 'risk': 0, 'name': 'Unknown'}

        self.selections.append(selected_actor)
        self.current_char_idx += 1
        
        terminated = (self.current_char_idx >= self.num_characters)
        truncated = False
        reward = 0
        
        if terminated:
            reward = self._calculate_final_reward()
            
        obs = self._get_obs()
        return obs, reward, terminated, truncated, {}

    def _calculate_final_reward(self):
        total_salary = sum(a.get('salary', 0) for a in self.selections)
        avg_rating = np.mean([a.get('rating', 0) for a in self.selections]) if self.selections else 0
        avg_vers = np.mean([a.get('versatility', 0) for a in self.selections]) if self.selections else 0
        total_risk = sum(a.get('risk', 0) for a in self.selections)
        
        raw_bo = sum(a.get('box_office', 0) for a in self.selections)
        final_bo = raw_bo * 0.7 * (1 + ((avg_rating - 7.0) * 0.1))
        
        SCALAR = 1000 # Normalized scalar
        
        # Reward Function: Maximize BO, Rating, Versatility. Minimize Risk and Budget Overflow.
        score = (final_bo / 1_000_000) + (avg_rating * 10) + (avg_vers * 0.5) - (total_risk * 50)

        if total_salary > self.budget_cap:
            overflow = total_salary - self.budget_cap
            score -= (overflow / 100_000) # Heavy penalty
            
        return score

def run_optimization(casting_data: dict, budget_cap: float):
    """
    Trains a PPO agent ad-hoc for this specific casting problem.
    """
    env = CastingEnv(casting_data, budget_cap=budget_cap)
    
    # Train
    model = PPO("MlpPolicy", env, verbose=0, learning_rate=0.002)
    model.learn(total_timesteps=1500)
    
    # Infer
    obs, _ = env.reset()
    done = False
    final_cast = []
    
    # The environment tracks the char index, so we just step through
    while not done:
        action, _ = model.predict(obs)
        
        # Capture the logic before stepping
        char_idx = env.current_char_idx
        if char_idx < len(casting_data['characters']):
            char = casting_data['characters'][char_idx]
            actors = char['actors']
            if actors:
                act_idx = int(action) if action < len(actors) else 0
                sel = actors[act_idx]
                final_cast.append({
                    "role": char['name'],
                    "actor_name": sel['name'],
                    "salary": sel.get('salary', 0),
                    "box_office": sel.get('box_office', 0),
                    "rating": sel.get('rating', 0),
                    "risk": sel.get('risk', 0)
                })
            else:
                 final_cast.append({"role": char['name'], "actor_name": "No Candidate Found", "salary": 0})

        obs, _, done, _, _ = env.step(action)
        
    return final_cast