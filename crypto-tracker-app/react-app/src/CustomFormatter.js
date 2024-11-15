export class CustomFormatter {
    static MarketCapFormatter(market_cap) {
        var val_str = "";
        if (market_cap > 1000000000) {
            market_cap /= 1000000000;
            val_str = market_cap
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "$ " + val_str + " B";
        } else if (market_cap > 1000000) {
            market_cap /= 1000000;
            val_str = market_cap
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "$ " + val_str + " M";
        } else {
            val_str = market_cap
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "$ " + val_str;
        }
    }
}
