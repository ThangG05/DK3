import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Lấy URL từ biến môi trường. 
# Render/Neon thường cung cấp link bắt đầu bằng postgres://
# Nhưng SQLAlchemy yêu cầu postgresql:// nên ta cần chuẩn hóa một chút.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Nếu chạy ở local mà không có biến môi trường, bạn có thể để một giá trị mặc định để test
if not SQLALCHEMY_DATABASE_URL:
    # Ví dụ: SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
    print("WARNING: DATABASE_URL not found!")

# 2. Tạo Engine để kết nối
# Với PostgreSQL, chúng ta không cần tham số 'check_same_thread' như SQLite
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. Tạo Session để thao tác với dữ liệu
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Lớp Base để các Model khác kế thừa
Base = declarative_base()

# 5. Hàm tiện ích để lấy session (Dependency Injection cho FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()