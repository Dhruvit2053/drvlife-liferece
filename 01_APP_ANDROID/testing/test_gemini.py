import urllib.request
import json
import base64

api_key = 'AIzaSyBO7qr...[REDACTED_GEMINI_KEY]'
url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}'

print("--- RUNNING REAL GEMINI AI VERIFICATION SUITE ---")

# 1. Financial Chat
chat_payload = {
    'contents': [{'parts': [{'text': 'You are DrvLife AI, a personal financial advisor in India. User asks: How can I optimize my food spending of Rs. 8,500 on a monthly income of Rs. 50,000?'}]}]
}
req = urllib.request.Request(url, data=json.dumps(chat_payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        reply = res['candidates'][0]['content']['parts'][0]['text']
        print("✓ TEST 1 (AI Chat): SUCCESS")
        print("Sample reply:", reply[:200].replace('\n', ' ') + "...")
except Exception as e:
    print("✗ TEST 1 FAILED:", e)

# 2. Structured JSON Insights
analysis_prompt = """
Here is the user's current month financial summary:
- Monthly Income: ₹50000
- Total Expenses: ₹18500
- Category Breakdown: Food: ₹8500, Travel: ₹3000, Bills: ₹5000, Shopping: ₹2000
- Recent 5 transactions: Swiggy: ₹450 (Food); Uber: ₹320 (Travel)

Analyze their spending and output 4 concise, highly actionable financial insights in the following JSON array format:
[
  {"title": "💡 Tip Title", "description": "Actionable 1-2 sentence advice.", "category": "Food"},
  {"title": "🔁 Subscription / Fixed", "description": "1-2 sentence audit advice.", "category": "Bills"},
  {"title": "📊 Spending Pattern", "description": "1-2 sentence behavior observation.", "category": "Shopping"},
  {"title": "⚠️ Caution / Goal", "description": "1-2 sentence alert or savings recommendation.", "category": "General"}
]
Return only valid JSON. Do not include markdown code fences if possible.
"""
payload2 = {'contents': [{'parts': [{'text': analysis_prompt}]}]}
req2 = urllib.request.Request(url, data=json.dumps(payload2).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req2) as resp:
        res2 = json.loads(resp.read().decode('utf-8'))
        raw_text = res2['candidates'][0]['content']['parts'][0]['text']
        clean_json = raw_text.replace("```json", "").replace("```", "").trim() if hasattr(raw_text, 'trim') else raw_text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_json)
        print("✓ TEST 2 (Structured JSON Insights): SUCCESS - Parsed items:", len(parsed))
        for item in parsed:
            print(f"  - [{item.get('category')}]: {item.get('title')} -> {item.get('description')}")
except Exception as e:
    print("✗ TEST 2 FAILED:", e)

# 3. Vision Receipt OCR
# Create a simple 100x100 PNG in-memory with white background
# Minimal valid 1x1 PNG bytes
png_1x1 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xdc\xccY\xe7\x00\x00\x00\x00IEND\xaeB`\x82'
b64_png = base64.b64encode(png_1x1).decode('utf-8')

vision_payload = {
    'contents': [{
        'parts': [
            {'inline_data': {'mime_type': 'image/png', 'data': b64_png}},
            {'text': 'Extract transaction details from this receipt image. Return JSON with keys: merchant, amount, date, category.'}
        ]
    }]
}
req3 = urllib.request.Request(url, data=json.dumps(vision_payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req3) as resp:
        res3 = json.loads(resp.read().decode('utf-8'))
        reply3 = res3['candidates'][0]['content']['parts'][0]['text']
        print("✓ TEST 3 (Multimodal Vision API): SUCCESS")
        print("Model vision response:", reply3[:180].replace('\n', ' '))
except Exception as e:
    print("✗ TEST 3 FAILED:", e)

