import urllib.request
import urllib.error
import json

API_KEY = "AIzaSyAoCSz...[REDACTED_CLIENT_IDENTIFIER]"

# Test sign in with user A credentials
signin_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
with open("firebase_live_audit_results.json", "r") as f:
    data = json.load(f)

uid = data.get("details", {}).get("user_a_uid")
print(f"Testing sign in for user with UID: {uid}")

# We used a generated email in previous script. Let's create a known test user and log in.
test_email = "test_user_audit@drvlife.test"
test_password = "AuditPassword@2026"

# Create or signin
req_payload = {"email": test_email, "password": test_password, "returnSecureToken": True}

try:
    req = urllib.request.Request(
        f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}",
        data=json.dumps(req_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    resp = urllib.request.urlopen(req)
    print("User created successfully.")
except urllib.error.HTTPError as e:
    err = json.loads(e.read().decode("utf-8"))
    if err.get("error", {}).get("message") == "EMAIL_EXISTS":
        print("User already exists, proceeding to sign-in...")
    else:
        print(f"SignUp error: {err}")

# Now sign in
try:
    req = urllib.request.Request(
        signin_url,
        data=json.dumps(req_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print(f"SignIn SUCCESS! UID: {res.get('localId')}, Email: {res.get('email')}")
except Exception as e:
    print(f"SignIn failed: {e}")

