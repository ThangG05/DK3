import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_phishing_email(to_email, subject, html_content, token):
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    base_url = os.getenv("BASE_URL")  # http://127.0.0.1:8000

    tracking_link = f"{base_url}/track/click?t={token}"
    tracking_pixel = f'<img src="{base_url}/track/open?t={token}" width="1" height="1" style="display:none;" />'

    # Nếu AI có placeholder
    if "[LINK_HERE]" in html_content:
        final_html = html_content.replace(
            "[LINK_HERE]",
            tracking_link
        )
    else:
        # fallback nếu AI không có link
        final_html = html_content + f"""
        <p>
            <a href="{tracking_link}" 
               style="background:#2563eb;color:#fff;padding:10px 16px;
                      text-decoration:none;border-radius:6px;font-weight:bold">
               Xác minh ngay
            </a>
        </p>
        """

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