from flask import Flask, request, jsonify
from flask_cors import CORS
from execute_python import execute_python_script
from execute_r import execute_r_script_docker
import uuid
import json
from pathlib import Path
LOG_FILE = Path(__file__).parent / "chart_log.json"
LOG_FILE.touch(exist_ok=True)

app = Flask(__name__)
CORS(app, allow_headers=["*"])

@app.route("/api/visualize", methods=["POST"])
def visualize():
    data = request.json
    code = data["code"]
    language = data["language"]
    file_id = str(uuid.uuid4())[:8]

    if language == "python":
        result = execute_python_script(code, file_id)
    elif language == "r":
        # Either use the existing function or the dockerized version:
        result = execute_r_script_docker(code, file_id)
    else:
        result = {"error": "Unsupported language."}

    if "url" in result:
        write_log({
            "language": language,
            "type": result["type"],
            "url": result["url"],
            "engine": result.get("engine", "unknown")
        })
        return jsonify(result)
    else:
        return jsonify({"error": result.get("error", "Unknown error")}), 400



# Load history
def read_history():
    try:
        with open(LOG_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

# Append to history
def write_log(entry):
    data = read_history()
    data.append(entry)
    with open(LOG_FILE, "w") as f:
        json.dump(data, f)

@app.route("/api/history", methods=["GET"])
def history():
    return jsonify(read_history())

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=4600)
