import os
import urllib
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

def get_engine():
    server = os.getenv("SQL_SERVER")
    database = os.getenv("SQL_DATABASE")
    username = os.getenv("SQL_USER")
    password = os.getenv("SQL_PASSWORD")

    # Xử lý chuỗi kết nối đặc biệt cho SQL Server instance (\SQLEXPRESS)
    connection_string = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        "TrustServerCertificate=yes;"
    )
    
    params = urllib.parse.quote_plus(connection_string)
    return create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()