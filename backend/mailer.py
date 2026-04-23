import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_phishing_email(to_email, subject, html_content, token):
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    
    # 1. FIX LỖI "NONE": Ép kiểm tra nếu là chuỗi "None" thì dùng link thật
    raw_url = os.getenv("BASE_URL")
    if not raw_url or str(raw_url).lower() == "none":
        base_url = "https://himass-backend.onrender.com"
    else:
        base_url = raw_url.rstrip('/')

    tracking_link = f"{base_url}/track/click?t={token}"
    tracking_pixel = f'<img src="{base_url}/track/open?t={token}" width="1" height="1" style="display:none;" />'

    # 2. DEBUG: In ra log Render để kiểm tra link lúc gửi
    print(f"DEBUG SENDING: Link is {tracking_link}")

    # 3. FIX LỖI PLACEHOLDER: Replace mạnh tay hơn
    final_html = str(html_content)
    if "[LINK_HERE]" in final_html:
        final_html = final_html.replace("[LINK_HERE]", tracking_link)
    
    # Nếu sau khi replace mà vẫn còn sót placeholder (do bị encode)
    final_html = final_html.replace("%5BLINK_HERE%5D", tracking_link)

    # 4. DỰ PHÒNG: Nếu trong mail không có link, tự chèn thêm một nút bấm ở cuối
    if tracking_link not in final_html:
        final_html += f'<p><a href="{tracking_link}" style="color:blue;">Cập nhật tại đây</a></p>'
    # Bọc lại HTML chuẩn email (rất quan trọng)
    final_html = f"""
    <html>
      <body style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        {final_html}
        {tracking_pixel}
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Hệ thống HVNH <{smtp_user}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    # UTF-8 để không lỗi tiếng Việt
    msg.attach(MIMEText(final_html, "html", "utf-8"))

    try:
        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Lỗi gửi mail: {e}")
        return False