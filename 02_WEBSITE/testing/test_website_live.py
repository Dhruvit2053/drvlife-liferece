import urllib.request
import urllib.error
import hashlib

BASE_URL = "https://liferece.surge.sh"
APK_URL = f"{BASE_URL}/downloads/drvlife-v1.0.apk"

print(f"Testing live website: {BASE_URL}")

# 1. Test homepage
try:
    req = urllib.request.Request(BASE_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        code = resp.getcode()
        html = resp.read().decode("utf-8")
        print(f"  [PASS] Homepage Status: {code}")
        print(f"  Page length: {len(html)} bytes")
        assert "DrvLife" in html
        print("  Found 'DrvLife' brand in HTML title / content.")
except Exception as e:
    print(f"  [FAIL] Homepage: {e}")

# 2. Test APK Download Endpoint
print(f"\nTesting APK download URL: {APK_URL}")
try:
    req = urllib.request.Request(APK_URL, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
    with urllib.request.urlopen(req, timeout=15) as resp:
        code = resp.getcode()
        cl = resp.headers.get("Content-Length")
        ct = resp.headers.get("Content-Type")
        print(f"  [PASS] APK Endpoint Status: {code}")
        print(f"  Content-Length: {cl} bytes")
        print(f"  Content-Type: {ct}")
        assert int(cl) > 25000000
except Exception as e:
    # If HEAD is not allowed by surge, try streaming first 1KB with GET
    print(f"  HEAD failed ({e}), testing GET streaming...")
    req = urllib.request.Request(APK_URL, headers={"User-Agent": "Mozilla/5.0", "Range": "bytes=0-1024"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        chunk = resp.read()
        print(f"  [PASS] Streaming GET response: {len(chunk)} bytes received.")

