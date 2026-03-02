import requests
import os


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def ask_llm(system_prompt, user_prompt):

    if not OPENROUTER_API_KEY:
        return "ERROR: OPENROUTER_API_KEY is not set."

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "arcee-ai/trinity-large-preview:free",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    try:
        result = response.json()

        # 🔍 DEBUG PRINT
        print("API RESPONSE:", result)

        if "choices" not in result:
            return f"API ERROR: {result}"

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Unexpected error: {str(e)}"