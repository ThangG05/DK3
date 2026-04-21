from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Unicode, UnicodeText
from datetime import datetime
from database import Base


class Employee(Base):
    __tablename__ = "Employees"

    EmployeeID = Column(Integer, primary_key=True, index=True)
    FullName = Column(Unicode(100), nullable=False)
    Email = Column(Unicode(150), unique=True, index=True, nullable=False)
    Department = Column(Unicode(100))
    IsActive = Column(Boolean, default=True)

    logs = relationship("PhishingLog", back_populates="employee")


class Campaign(Base):
    __tablename__ = "Campaigns"

    CampaignID = Column(Integer, primary_key=True, index=True)
    CampaignName = Column(Unicode(200), nullable=False)
    EmailSubject = Column(Unicode(250))
    EmailContent_HTML = Column(UnicodeText)
    CreatedDate = Column(DateTime, default=datetime.utcnow)
    Status = Column(Unicode(50), default="Draft")

    logs = relationship("PhishingLog", back_populates="campaign")


class PhishingLog(Base):
    __tablename__ = "PhishingLogs"

    LogID = Column(Integer, primary_key=True, index=True)
    CampaignID = Column(Integer, ForeignKey("Campaigns.CampaignID"))
    EmployeeID = Column(Integer, ForeignKey("Employees.EmployeeID"))

    TrackingToken = Column(Unicode(100), unique=True, index=True, nullable=False)

    IsOpened = Column(Boolean, default=False)
    IsClicked = Column(Boolean, default=False)
    IsDataSubmitted = Column(Boolean, default=False)

    SentAt = Column(DateTime, default=datetime.utcnow)
    OpenedAt = Column(DateTime, nullable=True)
    ClickedAt = Column(DateTime, nullable=True)

    IPAddress = Column(Unicode(50))
    UserAgent = Column(UnicodeText)

    employee = relationship("Employee", back_populates="logs")
    campaign = relationship("Campaign", back_populates="logs")