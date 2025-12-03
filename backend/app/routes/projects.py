from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.runner import process_project_background

router = APIRouter()

@router.post("/run", response_model=ProjectResponse)
async def create_project(
    data: ProjectCreate,
    background_tasks: BackgroundTasks, # <--- FastApi Background System
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # 1. Create DB Entry IMMEDIATELY as "pending"
    new_project = Project(
        user_id=current_user['id'],
        title=data.title,
        plot=data.plot,
        budget_cap=data.budget,
        industry=data.industry,
        status="pending"
    )
    
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    
    # 2. Trigger Background Task
    background_tasks.add_task(process_project_background, new_project.id)
    
    return new_project

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Verify ownership before deleting
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    
    if not project or project.user_id != current_user['id']:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")
        
    await db.delete(project)
    await db.commit()
    return {"status": "deleted"}

@router.get("/", response_model=list[ProjectResponse])
async def get_projects(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.execute(select(Project).where(Project.user_id == current_user['id']).order_by(Project.created_at.desc()))
    return result.scalars().all()
    
@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = await db.get(Project, project_id)
    if not project or project.user_id != current_user['id']:
        raise HTTPException(status_code=404, detail="Project not found")
    return project