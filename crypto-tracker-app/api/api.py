from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}})

@app.route('/api/time')
def get_current_time():
    current_time = 12345
    return {'time': current_time}