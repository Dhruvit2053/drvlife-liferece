import urllib.request
import urllib.error
import json
import uuid

API_KEY = "AIzaSyAoCSz01uv9ztt3iFT9owIr7FQ6bTxGaJ8"
PROJECT_ID = "com-example-liferece-fe149"
STORAGE_BUCKET = "com-example-liferece-fe149.firebasestorage.app"

results = {
    "auth_signup_test": None,
    "auth_signin_test": None,
    "firestore_api_status": None,
    "firestore_db_exists": False,
    "storage_bucket_status": None,
    "security_rules_verified": False,
    "details": {}
}

# 1. Test Auth Sign Up
test_email = f"audit_user_{uuid.uuid4().hex[:6]}@drvlife.test"
test_password = "Password@123!"

print(f"Testing Firebase Auth SignUp with {test_email}...")
signup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}"
signup_payload = {
    "email": test_email,
    "password": test_password,
    "returnSecureToken": True
}

token_user_a = None
uid_user_a = None

try:
    req = urllib.request.Request(
        signup_url,
        data=json.dumps(signup_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        token_user_a = data.get("idToken")
        uid_user_a = data.get("localId")
        print(f"  [SUCCESS] User created! UID: {uid_user_a}")
        results["auth_signup_test"] = "PASS"
        results["details"]["user_a_uid"] = uid_user_a
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    print(f"  [HTTP {e.code}] SignUp Error: {err_body}")
    results["auth_signup_test"] = f"FAIL (HTTP {e.code}: {err_body})"
except Exception as e:
    print(f"  [ERR] SignUp Error: {e}")
    results["auth_signup_test"] = f"FAIL ({e})"

# 2. Test Firestore Database REST Endpoint
print("\nTesting Firestore (default) database documents endpoint...")
firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"
headers = {"Content-Type": "application/json"}
if token_user_a:
    headers["Authorization"] = f"Bearer {token_user_a}"

try:
    req = urllib.request.Request(firestore_url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"  [SUCCESS] Firestore documents endpoint responded: {data}")
        results["firestore_api_status"] = "ACTIVE"
        results["firestore_db_exists"] = True
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    print(f"  [HTTP {e.code}] Firestore Error: {err_body}")
    results["firestore_api_status"] = f"HTTP {e.code}"
    results["details"]["firestore_error"] = json.loads(err_body) if err_body.startswith("{") else err_body
except Exception as e:
    print(f"  [ERR] Firestore Error: {e}")
    results["firestore_api_status"] = f"ERR ({e})"

# 3. Test Storage Bucket Availability
print("\nTesting Firebase Storage Bucket availability...")
storage_url = f"https://firebasestorage.googleapis.com/v0/b/{STORAGE_BUCKET}/o"
if token_user_a:
    headers = {"Authorization": f"Bearer {token_user_a}"}
else:
    headers = {}

try:
    req = urllib.request.Request(storage_url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"  [SUCCESS] Storage bucket responded: {data}")
        results["storage_bucket_status"] = "ACTIVE"
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    print(f"  [HTTP {e.code}] Storage Error: {err_body}")
    results["storage_bucket_status"] = f"HTTP {e.code}"
    results["details"]["storage_error"] = err_body
except Exception as e:
    print(f"  [ERR] Storage Error: {e}")
    results["storage_bucket_status"] = f"ERR ({e})"

with open("firebase_live_audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\n=== SUMMARY ===")
print(json.dumps(results, indent=2))

