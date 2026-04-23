from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime

import models, database, ai_services, mailer, schemas

# Tự động tạo bảng trên PostgreSQL (Neon) khi khởi động
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HIMASS Phishing Training System API")

# ================================
# UTF-8 FIX (Giữ nguyên cho tiếng Việt)
# ================================
@app.middleware("http")
async def add_charset(request, call_next):
    response = await call_next(request)
    if "Content-Type" in response.headers and "application/json" in response.headers["Content-Type"]:
        response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

# ================================
# CORS - Đã fix để nhận link Frontend từ Render/Vercel
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "*") # Cho phép link deploy thực tế
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# 1. GLOBAL STATS
# ================================
@app.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    total_employees = db.query(models.Employee).count()
    total_sent = db.query(models.PhishingLog).count()

    total_clicked = db.query(models.PhishingLog).filter(
        models.PhishingLog.IsClicked == True
    ).count()

    click_rate = (total_clicked / total_sent * 100) if total_sent else 0

    return {
        "total_employees": total_employees,
        "total_sent": total_sent,
        "total_clicked": total_clicked,
        "click_rate": round(click_rate, 2)
    }

# ================================
# 2. EMPLOYEES
# ================================
@app.get("/employees/", response_model=list[schemas.Employee])
def get_employees(db: Session = Depends(database.get_db)):
    return db.query(models.Employee).all()

@app.post("/employees/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(database.get_db)):
    db_employee = models.Employee(
        FullName=employee.FullName,
        Email=employee.Email,
        Department=employee.Department,
        IsActive=True
    )
    db.add(db_employee)
    try:
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

# ================================
# 3. GENERATE EMAIL (AI)
# ================================
@app.post("/campaigns/generate")
def generate_email(payload: schemas.CampaignRequest):
    ai_res = ai_services.generate_phishing_content(payload.topic)
    if not ai_res or "subject" not in ai_res or "body" not in ai_res:
        raise HTTPException(status_code=500, detail="AI generate lỗi")
    return ai_res

# ================================
# 4. CREATE CAMPAIGN
# ================================
@app.post("/campaigns")
def create_campaign(payload: schemas.CampaignCreate, db: Session = Depends(database.get_db)):
    campaign = models.Campaign(
        CampaignName=payload.name,
        EmailSubject=payload.subject,
        EmailContent_HTML=payload.body,
        Status="Draft"
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign

# ================================
# 5. GET CAMPAIGNS
# ================================
@app.get("/campaigns")
def get_campaigns(db: Session = Depends(database.get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.CreatedDate.desc()).all()

# ================================
# 6. CAMPAIGN DETAIL
# ================================
@app.get("/campaigns/{campaign_id}")
def get_campaign_detail(campaign_id: int, db: Session = Depends(database.get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.CampaignID == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Không tìm thấy campaign")

    total_sent = db.query(models.PhishingLog).filter(models.PhishingLog.CampaignID == campaign_id).count()
    total_clicked = db.query(models.PhishingLog).filter(
        models.PhishingLog.CampaignID == campaign_id,
        models.PhishingLog.IsClicked == True
    ).count()

    click_rate = (total_clicked / total_sent * 100) if total_sent else 0
    return {
        "campaign": campaign,
        "stats": {
            "total_sent": total_sent,
            "total_clicked": total_clicked,
            "click_rate": round(click_rate, 2)
        }
    }

# ================================
# 7. SEND CAMPAIGN
# ================================
@app.post("/campaigns/{campaign_id}/send")
def send_campaign(campaign_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.CampaignID == campaign_id).first()
    if not campaign or campaign.Status == "Completed":
        raise HTTPException(status_code=400, detail="Campaign không hợp lệ hoặc đã hoàn thành")

    targets = db.query(models.Employee).filter(models.Employee.IsActive == True).all()
    if not targets:
        raise HTTPException(status_code=404, detail="Không có nhân viên")

    subject = campaign.EmailSubject
    body = campaign.EmailContent_HTML

    def process():
        inner_db = database.SessionLocal()
        try:
            for i, emp in enumerate(targets):
                token = str(uuid.uuid4())
                if mailer.send_phishing_email(emp.Email, subject, body, token):
                    log = models.PhishingLog(CampaignID=campaign_id, EmployeeID=emp.EmployeeID, TrackingToken=token)
                    inner_db.add(log)
                if i % 20 == 0: inner_db.commit()
            
            camp = inner_db.query(models.Campaign).filter(models.Campaign.CampaignID == campaign_id).first()
            if camp: camp.Status = "Completed"
            inner_db.commit()
        finally:
            inner_db.close()

    campaign.Status = "Processing"
    db.commit()
    background_tasks.add_task(process)
    return {"message": "Đang gửi campaign..."}

# ================================
# 8. TRACK CLICK (Fix utcnow)
# ================================
@app.get("/track/click")
def track_click(t: str = Query(...), db: Session = Depends(database.get_db)):
    log = db.query(models.PhishingLog).filter(models.PhishingLog.TrackingToken == t).first()
    if log and not log.IsClicked:
        log.IsClicked = True
        log.ClickedAt = datetime.now()
        db.commit()

    # Thắng sửa lại dòng này: ưu tiên link thực tế nếu không tìm thấy biến môi trường
    frontend_url = os.getenv("FRONTEND_URL", "https://dk-3-zeta.vercel.app")
    
    # Đảm bảo URL cuối cùng trông như thế này: https://dk-3-zeta.vercel.app/warning?t=...
    redirect_target = f"{frontend_url.rstrip('/')}/warning?t={t}"
    
    return RedirectResponse(url=redirect_target)
# ================================
# 9. TRACK OPEN
# ================================
@app.get("/track/open")
def track_open(t: str = Query(...), db: Session = Depends(database.get_db)):
    log = db.query(models.PhishingLog).filter(models.PhishingLog.TrackingToken == t).first()
    if log and not getattr(log, "IsOpened", False):
        log.IsOpened = True
        db.commit()
    return Response(content=b"", media_type="image/png")
# ================================
# BỔ SUNG: XÓA NHÂN VIÊN
# ================================
@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(database.get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.EmployeeID == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên để xóa")
    
    try:
        db.delete(db_employee)
        db.commit()
        return {"message": f"Đã xóa nhân viên có ID {employee_id}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Không thể xóa nhân viên này (có thể liên quan đến dữ liệu chiến dịch)")
# ================================
# RUN (Lưu ý: Render sẽ dùng lệnh trong Dockerfile)
# ================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)