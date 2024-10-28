"""Main application"""
# TODO: split up?

from flask import Flask, request
import time
from flask_cors import CORS
import requests
import os
import datetime

app = Flask(__name__)
CORS(app)

@app.route("/time")
def getTime():
    return {"time": time.time()}

COIN_GECKO_KEY = os.environ["COIN_GECKO_KEY"]
NEWS_KEY = os.environ["NEWS_KEY"]

# React -> Flask
# TODO: how to get parameters and search options from react into flask?
# current strategy, query backend routes using ? params

# TODO: for all requests.text returns, maybe edit to whatever kind of output we want on the page
# decide at next meeting?

@app.route("/")
def hello():

    response = requests.get(f"https://api.coingecko.com/api/v3/ping",
                            params={"x_cg_demo_api_key":COIN_GECKO_KEY},
                            headers={"accept": "application/json"})

    return response.text


@app.route("/list")
def list():
    response = requests.get(f"https://api.coingecko.com/api/v3/coins/list",
                            headers={"accept": "application/json"})
    coin_list = [coin for coin in response.json()]
    return coin_list

@app.route("/price")
def price():
    """Search for name/symbol of coin to view price/market data"""

    # How to use right now: localhost:5001/price?search=<VALID COIN ID>

    search = request.args.get('search')

    # TODO: add some search validation to make sure each ID
    # TODO: add validation for multiple coins per search (comparison?)

    response = requests.get(f"https://api.coingecko.com/api/v3/simple/price",
                            params={
                                "vs_currencies":"usd",
                                "ids":search,
                                "include_market_cap":"true",
                                "include_24hr_vol":"true",
                                "include_24hr_change":"true",
                                "include_last_updated_at":"true",
                                "x_cg_demo_api_key":COIN_GECKO_KEY
                            },
                            headers={"accept": "application/json"})

    return response.json()


@app.route("/trends")
def trends():
    """Market trends"""

    # How to use right now: localhost:5001/trends?id=<VALID COIN ID>

    # TODO: not sure about which coingecko api endpoint to use for this.
    # TODO: input for from-to dates (datetime in s?)
    # TODO: cryptocurrency id validation via database table

    id = request.args.get('id')

    response = requests.get(f"https://api.coingecko.com/api/v3/coins/markets",
                            params={
                                "vs_currency":"usd",
                                "ids":id,
                                "sparkline":"true",
                                "x_cg_demo_api_key":COIN_GECKO_KEY
                            },
                            headers={"accept": "application/json"})

    return response.text


@app.route("/historical")
def historical():
    """Query historical data api"""

    # How to use right now: localhost:5001/historical?id=<VALID COIN ID>

    # TODO: input for from-to dates (datetime in s?)
    # TODO: cryptocurrency id validation via database table

    id = request.args.get('id')
    
    response = requests.get(f"https://api.coingecko.com/api/v3/coins/{id}/market_chart/range",
                            params={
                                "vs_currency":"usd",
                                "from":1711929600,
                                "to":1712275200,
                                "x_cg_demo_api_key":COIN_GECKO_KEY
                            },
                            headers={"accept": "application/json"})

    return response.text

@app.route("/news")
def news():
    """Query news api"""

    # How to use right now: localhost:5001/news?search=<VALID COIN ID>

    # TODO: how are we deciding on from and to dates? inputs from user on frontend?
    # datetime conversion?
    # sortby option? check documentation...

    search = request.args.get('search')

    response = requests.get("https://newsapi.org/v2/everything",
                            params={
                                "q":search,
                                # "from":"2024-10-26",
                                # "to":"2024-10-26",
                                "sortBy":"popularity",
                                "apiKey":NEWS_KEY
                            },
                            headers={"accept": "application/json"})

    return response.text

# TODO: populate database
# TODO: account crud
# TODO: portfolio crud and summation
# dummy values
ACCOUNT = {"username":"aaaaa", "wallet": "bitcoin"}

@app.route("/account")
def account():
    """Account management"""

    # How to use right now: localhost:5001/account

    return ACCOUNT["username"]

@app.route("/portfolio")
def portfolio():
    """Portfolio management"""

    # How to use right now: localhost:5001/portfolio

    return ACCOUNT["wallet"]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)