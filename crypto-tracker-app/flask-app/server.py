from flask import Flask
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/time")
def getTime():
    return {"time": time.time()}

if __name__ == "__main__":
    app.run(debug=True)