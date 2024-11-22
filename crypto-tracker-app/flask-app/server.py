"""Main application"""
# TODO: split up?

from flask import Flask, request, jsonify
import time
from flask_cors import CORS, cross_origin
import requests
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
app.config['CORS_HEADERS'] = 'Content-Type'

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

@app.route("/cointable")
@cross_origin()
def coinTable():
    # How to use right now: localhost:5001/cointable
    try:
        response = requests.get(f"https://api.coingecko.com/api/v3/coins/markets",
                            params={
                                    "x_cg_demo_api_key":COIN_GECKO_KEY,
                                    "vs_currency":"usd",
                                    "order": "market_cap_desc",
                                    "per_page": 100,
                                    "page": 1,
                                    # include sparkline 7 days data
                                    "sparkline": "true",
                                    "price_change_percentage": "24h",
                                    "locale": "en",
                            }, headers={"accept": "application/json"})
        
        coinTableData = []
        for i, item in enumerate(response.json()):
            price_7days = item.get("sparkline_in_7d").get("price")
            price_change_7days = (price_7days[-1] - price_7days[0]) / price_7days[0]
            coinTableData.append({
                "id": item.get("id"),
                "rank": i + 1,
                "coin": {
                    "name": item.get("name"),
                    "image": item.get("image"),
                    "symbol": item.get("symbol"),
                },
                "current_price": item.get("current_price"),
                "market_cap": item.get("market_cap"),
                "market_cap_change_percentage_24h": item.get("market_cap_change_percentage_24h"),
                "price_change_percentage_24h": item.get("price_change_percentage_24h"),
                "price_change_percentage_7d": rf"{price_change_7days * 100:.5f}%",
                "sparkline": [{"x": i + 1, "y": price} for i, price in enumerate(price_7days)] ,
            })
        return coinTableData, 200
    except requests.RequestException as e:
        return jsonify({"error": "Unable to fetch data from CoinGecko"}), 500
   

@app.route("/list")
def list():
    """Get a list of supported coins on CoinGecko with coins id, name and symbol"""
    # How to use right now: localhost:5001/list
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


@app.route('/price-chart', methods=['GET'])
@cross_origin()
def priceChartData():
    """Query historical data api"""

    # How to use right now: localhost:5001/historical-price-chart?id=<VALID COIN ID>&days=<# OF DAYS>

    # TODO: input for from-to dates (datetime in s?)
    # TODO: cryptocurrency id validation via database table

    id = request.args.get('id')
    num_days = request.args.get('days', 7)  # Default to 7 days if 'days' parameter is not provided
    try:
        num_days = int(num_days)
        if num_days <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "The 'days' parameter must be a positive integer"}), 400
    today_time = datetime.now()
    today_UNIX = int(today_time.timestamp()) 
    from_time = today_time - timedelta(hours=(24 * num_days))
    from_UNIX = int(from_time.timestamp()) 
    try:
        response = requests.get(
            f"https://api.coingecko.com/api/v3/coins/{id}/market_chart/range",
            params={
                "vs_currency": "usd",
                "from": from_UNIX,
                "to": today_UNIX,
                "x_cg_demo_api_key": COIN_GECKO_KEY
            },
            headers={"accept": "application/json"}
        )
    except requests.RequestException as e:
        return jsonify({f"error": "Unable to fetch data from CoinGecko: {e}"}), 500

    try:
        prices = response.json().get("prices", [])
        chart_data = [{"x": price[0], "y": price[1]} for price in prices]
    except (ValueError, KeyError) as e:
        return jsonify({f"error": "Error processing data: {e}"}), 500
    
    return jsonify(chart_data), 200

# How to use right now: localhost:5001/coin-data?id=<VALID COIN ID>
@app.route('/coin-data', methods=['GET'])
def coinData():
    id = request.args.get('id')
        # Query CoinGecko API
    try:
        response = requests.get(
            f"https://api.coingecko.com/api/v3/coins/{id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
            params={
                "x_cg_demo_api_key": COIN_GECKO_KEY
            },
            headers={"accept": "application/json"}
        )
        response = response.json()
        data = {
            "id": response.get("id"),
            "name": response.get("name"),
            "symbol": response.get("symbol"),
            "description": response.get("description").get("en"),
            "image": response.get("image"),
            "current_price": response.get("market_data").get("current_price").get("usd"),
            "market_cap_rank": response.get("market_data").get("market_cap_rank"),
            "market_cap": response.get("market_data").get("market_cap").get("usd"),
            "price_change_24h": response.get("market_data").get("price_change_24h"),
            "price_change_percentage_24h": response.get("market_data").get("price_change_percentage_24h"),
            "price_change_percentage_7d": response.get("market_data").get("price_change_percentage_7d"),
            "price_change_percentage_14d": response.get("market_data").get("price_change_percentage_14d"),
            "price_change_percentage_30d": response.get("market_data").get("price_change_percentage_30d"),
            "price_change_percentage_1y": response.get("market_data").get("price_change_percentage_1y"),
            "market_cap_change_24h": response.get("market_data").get("market_cap_change_24h"),
            "market_cap_change_percentage_24h": response.get("market_data").get("market_cap_change_percentage_24h"),
        }

        return data
    except requests.RequestException as e:
        return jsonify({"error": "Unable to fetch data from CoinGecko"}), 500
    
 

@app.route("/news")
def news():
    """Query news api"""

    # How to use right now: localhost:5001/news?search=<COIN Name>

    # TODO: how are we deciding on from and to dates? inputs from user on frontend?
    # datetime conversion?
    # sortby option? check documentation...

    search = request.args.get('search')
    print(search)
    today = datetime.now() - timedelta(days=1)
    todayDate = today.split('T')[0]
    response = requests.get("https://newsapi.org/v2/everything",
                            params={
                                "q": search,
                                # "from":"2024-10-26",
                                # "to":"2024-10-26",
                                "language":"en",
                                # "from": today.isoformat(),
                                "sortBy": "popularity",
                                "pageSize": 9,
                                "apiKey": "f663499b1a764142b84c6daf5e950fcf",
                            },
                            headers={"accept": "application/json"})

    return todayDate +'\n' + response.text

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