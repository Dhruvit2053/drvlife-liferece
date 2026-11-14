import urllib.request
import json
import re

def test_live_site():
    url = "https://liferece.surge.sh"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        status = resp.status
        headers = dict(resp.headers)
        
    print(f"URL: {url}")
    print(f"Status: {status}")
    print(f"HTML Size: {len(html)} bytes")
    print(f"Has CSP Meta: {'Content-Security-Policy' in html}")
    print(f"Has Root Element: {'id=\"root\"' in html}")
    
    # Extract scripts
    scripts = re.findall(r'<script.*?src=["\'](.*?)["\']', html)
    print(f"Scripts Found: {scripts}")
    
    # Check each script asset
    for s in scripts:
        script_url = s if s.startswith("http") else f"{url}{s}"
        s_req = urllib.request.Request(script_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(s_req) as s_resp:
            print(f"  Asset {s}: Status {s_resp.status}, Size {len(s_resp.read())} bytes")

    # Check APK download link
    apk_url = f"{url}/downloads/drvlife-v1.0.apk"
    apk_req = urllib.request.Request(apk_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(apk_req) as apk_resp:
        apk_len = apk_resp.headers.get("Content-Length")
        print(f"APK Download ({apk_url}): Status {apk_resp.status}, Content-Length {apk_len} bytes")

if __name__ == "__main__":
    test_live_site()

