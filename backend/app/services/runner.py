import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.services.ai_engine import AIEngine
from app.services.rl_optimizer import run_optimization
from app.db.session import AsyncSessionLocal

ai_engine = AIEngine()

async def process_project_background(project_id: int):
    """
    Runs the AI pipeline and RL optimization in the background.
    Updates the DB status when finished.
    """
    async with AsyncSessionLocal() as db:
        try:
            # 1. Fetch Project
            project = await db.get(Project, project_id)
            if not project: return

            # 2. Run AI Extraction & Search
            print(f"🔄 [Task] Starting AI Pipeline for Project {project_id}...")
            pipeline_data = await ai_engine.run_pipeline(project.plot, project.budget_cap, project.industry)
            
            # 3. Run RL Optimization
            print(f"🧠 [Task] Starting RL Optimization for Project {project_id}...")
            # Note: run_optimization is synchronous (CPU bound), so we might want to wrap it if it blocks too long,
            # but for this scale, direct call is fine in background thread.
            final_cast = run_optimization(pipeline_data, project.budget_cap)
            
            # 4. Update DB
            project.raw_characters = pipeline_data
            project.optimization_result = final_cast
            project.status = "completed"
            
            db.add(project)
            await db.commit()
            print(f"✅ [Task] Project {project_id} Completed Successfully.")

        except Exception as e:
            print(f"❌ [Task] Project {project_id} Failed: {e}")
            project = await db.get(Project, project_id)
            if project:
                project.status = "failed"
                db.add(project)
                await db.commit()