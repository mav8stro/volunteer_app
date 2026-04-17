from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

events = [
    {"id": 1, "title": "Community Garden Clean-Up", "date": "2025-05-10", "location": "Central Park"},
    {"id": 2, "title": "Food Bank Sorting Drive",   "date": "2025-05-17", "location": "Downtown Shelter"},
    {"id": 3, "title": "Beach Litter Pickup",       "date": "2025-05-24", "location": "Sunrise Beach"},
]

volunteers = []

@app.route("/events")
def get_events():
    return jsonify(events)

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip()
    if not name or not email:
        return jsonify({"error": "Name and email required"}), 400
    volunteers.append({"name": name, "email": email})
    return jsonify({"message": f"Welcome, {name}!"}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
