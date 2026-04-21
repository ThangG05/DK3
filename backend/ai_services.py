import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ==============================
# CLEAN + EXTRACT JSON (CHUẨN)
# ==============================
def extract_json(text: str):
    try:
        return json.loads(text)
    except:
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            raw = match.group()

            # 🔥 FIX LỖI JSON (quan trọng nhất)
            raw = raw.replace('\n', '\\n').replace('\r', '')

            try:
                return json.loads(raw)
            except Exception as e:
                print("JSON parse fail:", e)

    return None


# ==============================
# MAIN GENERATOR
# ==============================
def generate_phishing_content(topic: str):
    try:
        prompt = f"""
Bạn là chuyên gia an toàn thông tin, tạo email phishing giả lập cực kỳ giống thật.

YÊU CẦU:
- Tiếng Việt chuẩn 100%, không lỗi dấu
- Văn phong giống email thật (HR / IT / ngân hàng)
- Nội dung đa dạng, không lặp lại

PHẢI CÓ:
- Subject hấp dẫn (có thể chứa ⚠️, KHẨN, ...)
- Lời chào (Kính gửi Anh/Chị)
- Nội dung logic
- 1 link duy nhất: [LINK_HERE]
- Chữ ký chuyên nghiệp

HTML:
- Trả về HTML hoàn chỉnh
- Style inline
- KHÔNG markdown
- TOÀN BỘ HTML PHẢI TRÊN 1 DÒNG (không xuống dòng)

QUY TẮC:
- CHỈ trả JSON
- KHÔNG giải thích
- KHÔNG text ngoài JSON

FORMAT:
{{
  "subject": "...",
  "body": "<div>...</div>"
}}

CHỦ ĐỀ: {topic}
"""

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Chỉ trả JSON hợp lệ, không xuống dòng trong value."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.95,
            top_p=0.9,
        )

        content = chat_completion.choices[0].message.content.strip()

        print("========== RAW ==========")
        print(content)
        print("========== END ==========")

        data = extract_json(content)

        if not data:
            raise ValueError("AI trả sai JSON")

        subject = data.get("subject", "").strip()
        body = data.get("body", "").strip()

        if not subject or not body:
            raise ValueError("Thiếu subject/body")

        # đảm bảo có link
        if "[LINK_HERE]" not in body:
            body += '<p><a href="[LINK_HERE]">Xác minh ngay</a></p>'

        return {
            "subject": subject,
            "body": body
        }

    except Exception as e:
        print("❌ AI ERROR:", e)

        # fallback (chỉ khi AI chết)
        return {
            "subject": "⚠️ [KHẨN] Xác minh tài khoản nội bộ",
            "body": "<div style=\"font-family:Arial,sans-serif;line-height:1.6\"><p>Kính gửi Anh/Chị,</p><p>Hệ thống phát hiện hoạt động bất thường trên tài khoản của bạn.</p><p>Vui lòng xác minh ngay:</p><p><a href=\"[LINK_HERE]\" style=\"background:#2563eb;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;font-weight:bold\">Xác minh ngay</a></p><p>Nếu không thực hiện, tài khoản có thể bị khóa.</p><p>Trân trọng,<br/>Phòng CNTT</p></div>"
        }