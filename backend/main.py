import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import Base, engine, get_db
from models import Idea, Project, Task, Script, Analytics
from schemas import IdeaCreate, ProjectCreate, TaskCreate, ScriptCreate, AnalyticsCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CreatorFlow API", version="1.0.0",
              description="Content Creation and Video Production Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "CreatorFlow API is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

def crud_routes(path, model, schema):
    @app.get(f"/api/{path}")
    def get_all(db: Session = Depends(get_db)):
        return db.query(model).order_by(model.id.desc()).all()

    @app.post(f"/api/{path}")
    def create(item: schema, db: Session = Depends(get_db)):
        obj = model(**item.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @app.put(f"/api/{path}/{{item_id}}")
    def update(item_id: int, item: schema, db: Session = Depends(get_db)):
        obj = db.query(model).filter(model.id == item_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail="Item not found")
        for key, value in item.model_dump().items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
        return obj

    @app.delete(f"/api/{path}/{{item_id}}")
    def delete(item_id: int, db: Session = Depends(get_db)):
        obj = db.query(model).filter(model.id == item_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail="Item not found")
        db.delete(obj)
        db.commit()
        return {"message": "Deleted successfully"}

crud_routes("ideas", Idea, IdeaCreate)
crud_routes("projects", Project, ProjectCreate)
crud_routes("tasks", Task, TaskCreate)
crud_routes("scripts", Script, ScriptCreate)
crud_routes("analytics", Analytics, AnalyticsCreate)

@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return {
        "ideas": db.query(Idea).count(),
        "projects": db.query(Project).count(),
        "tasks": db.query(Task).count(),
        "completed_tasks": db.query(Task).filter(Task.status == "Completed").count(),
        "scripts": db.query(Script).count(),
        "published": db.query(Project).filter(Project.status == "Published").count(),
        "total_views": db.query(func.sum(Analytics.views)).scalar() or 0,
        "total_likes": db.query(func.sum(Analytics.likes)).scalar() or 0,
        "total_comments": db.query(func.sum(Analytics.comments)).scalar() or 0
    }

@app.get("/api/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    rows = db.query(
        Analytics.platform,
        func.sum(Analytics.views).label("views"),
        func.sum(Analytics.likes).label("likes"),
        func.sum(Analytics.comments).label("comments")
    ).group_by(Analytics.platform).all()

    return [
        {"platform": r.platform, "views": r.views or 0,
         "likes": r.likes or 0, "comments": r.comments or 0}
        for r in rows
    ]
