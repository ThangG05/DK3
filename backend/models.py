from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, String, Text
from sqlalchemy.orm import relationship
# Import func để dùng thời gian hệ thống của Database
from sqlalchemy.sql import func 
from database import Base

class Employee(Base):
    __tablename__ = "Employees"

    EmployeeID = Column(Integer, primary_key=True, index=True)
    FullName = Column(String(100), nullable=False) # Dùng String cho chuẩn Postgres
    Email = Column(String(150), unique=True, index=True, nullable=False)
    Department = Column(String(100))
    IsActive = Column(Boolean, default=True)

    logs = relationship("PhishingLog", back_populates="employee")


class Campaign(Base):
    __tablename__ = "Campaigns"

    CampaignID = Column(Integer, primary_key=True, index=True)
    CampaignName = Column(String(200), nullable=False)
    EmailSubject = Column(String(250))
    EmailContent_HTML = Column(Text) # Dùng Text thay cho UnicodeText
    # Sử dụng server_default=func.now() để Database tự điền thời gian
    CreatedDate = Column(DateTime(timezone=True), server_default=func.now())
    Status = Column(String(50), default="Draft")

    logs = relationship("PhishingLog", back_populates="campaign")


class PhishingLog(Base):
    __tablename__ = "PhishingLogs"

    LogID = Column(Integer, primary_key=True, index=True)
    CampaignID = Column(Integer, ForeignKey("Campaigns.CampaignID"))
    EmployeeID = Column(Integer, ForeignKey("Employees.EmployeeID"))

    TrackingToken = Column(String(100), unique=True, index=True, nullable=False)

    IsOpened = Column(Boolean, default=False)
    IsClicked = Column(Boolean, default=False)
    IsDataSubmitted = Column(Boolean, default=False)

    # Dùng server_default để DB tự xử lý thời gian
    SentAt = Column(DateTime(timezone=True), server_default=func.now())
    OpenedAt = Column(DateTime(timezone=True), nullable=True)
    ClickedAt = Column(DateTime(timezone=True), nullable=True)

    IPAddress = Column(String(50))
    UserAgent = Column(Text)

    employee = relationship("Employee", back_populates="logs")
    campaign = relationship("Campaign", back_populates="logs")