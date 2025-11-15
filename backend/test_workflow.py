"""
Quick test script to verify the complete JudgmentAI workflow.
Tests: Auth → Scrape → Chat
"""
import requests
import time
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_workflow():
    print("🧪 Testing JudgmentAI Workflow\n")

    # 1. Signup
    print("1️⃣ Testing signup...")
    signup_response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={
            "email": f"test{int(time.time())}@gmail.com",
            "password": "testpass123"
        }
    )

    if signup_response.status_code not in [200, 201]:
        print(f"❌ Signup failed: {signup_response.text}")
        return

    token = signup_response.json()["access_token"]
    print(f"✅ Signup successful! Token: {token[:20]}...\n")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Trigger scrape
    print("2️⃣ Testing Reddit scrape (small thread)...")
    scrape_response = requests.post(
        f"{BASE_URL}/scrape",
        headers=headers,
        json={
            "reddit_url": "https://www.reddit.com/r/AskReddit/comments/dxosj/what_word_or_phrase_did_you_totally_misunderstand/",
            "max_comments": 50
        }
    )

    if scrape_response.status_code != 200:
        print(f"❌ Scrape failed: {scrape_response.text}")
        return

    task_data = scrape_response.json()
    task_id = task_data["task_id"]
    print(f"✅ Scrape task started! Task ID: {task_id}\n")

    # 3. Poll task status
    print("3️⃣ Waiting for scrape to complete...")
    max_wait = 120  # 2 minutes
    start_time = time.time()

    while time.time() - start_time < max_wait:
        status_response = requests.get(
            f"{BASE_URL}/scrape/status/{task_id}",
            headers=headers
        )

        if status_response.status_code != 200:
            print(f"❌ Status check failed: {status_response.text}")
            return

        status_data = status_response.json()
        status = status_data["status"]

        print(f"   Status: {status}")

        if status == "success":
            print(f"✅ Scrape complete!\n")
            print(f"   Results: {json.dumps(status_data.get('result'), indent=2)}\n")
            break
        elif status == "failure":
            print(f"❌ Scrape failed: {status_data.get('error')}")
            return

        time.sleep(5)
    else:
        print(f"⏱️ Scrape still running after {max_wait}s. Check logs manually.")
        return

    # 4. Test chat
    print("4️⃣ Testing chat with RAG...")
    chat_response = requests.post(
        f"{BASE_URL}/chat",
        headers=headers,
        json={
            "message": "What are people saying in the discussions you analyzed?"
        }
    )

    if chat_response.status_code != 200:
        print(f"❌ Chat failed: {chat_response.text}")
        return

    chat_data = chat_response.json()
    print(f"✅ Chat response:\n")
    print(f"   {chat_data['response'][:200]}...\n")

    print("🎉 All tests passed! JudgmentAI is working correctly.")

if __name__ == "__main__":
    try:
        test_workflow()
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
