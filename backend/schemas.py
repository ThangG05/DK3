from pydantic import BaseModel

# ================================
# EMPLOYEE
# ================================
class Employee(BaseModel):
    EmployeeID: int
    FullName: str
    Email: str
    Department: str | None
    IsActive: bool

    class Config:
        from_attributes = True


class EmployeeCreate(BaseModel):
    FullName: str
    Email: str
    Department: str | None = None


# ================================
# CAMPAIGN
# ================================
class CampaignRequest(BaseModel):
    name: str | None = None
    topic: str


# 👉 THÊM CÁI NÀY (QUAN TRỌNG)
class CampaignCreate(BaseModel):
    name: str
    subject: str
    body: str