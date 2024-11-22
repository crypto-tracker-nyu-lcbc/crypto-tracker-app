import React, { useEffect, useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Typography, Divider } from "@mui/material";
import { Avatar } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { CustomFormatter } from "./CustomFormatter.js";

function getChangePercentageRow(change_percentage, duration_str) {
    return (
        <div
            className="cardCurrentPrice"
            style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "flex-end",
            }}
        >
            <Typography style={{ margin: 0 }}>{duration_str} Change</Typography>
            {change_percentage > 0 ? (
                <Typography
                    style={{
                        margin: 0,
                        color: "green",
                        display: "flex",
                    }}
                >
                    {change_percentage + " %"}
                    <ArrowDropUp />
                </Typography>
            ) : (
                <Typography
                    style={{ margin: 0, color: "red", display: "flex" }}
                >
                    {change_percentage + " %"}
                    <ArrowDropDown />
                </Typography>
            )}
        </div>
    );
}

function CoinCard(props) {
    const [data, setData] = useState([]);
    const [img, setImg] = useState(null);

    // Fetch data function memoized to prevent recreation
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/coin-data?id=${props.id}`
            );
            const result = await response.json();
            setData(result);
            setImg(result.image.small);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                fetchData();
            }, 1000);
        }
    }, [props.id]); // Dependency for fetchData

    // Use useEffect to fetch data only once
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Add fetchData as a dependency

    return (
        <Card
            variant="outlined"
            style={{ flexGrow: 1, minWidth: props.minWidth }}
        >
            <CardContent>
                <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: "small" }}
                >
                    {data.symbol}
                </Typography>
                <CardHeader
                    style={{ padding: "0" }}
                    variant="h1"
                    avatar={
                        <Avatar
                            alt={data.name}
                            src={img}
                            sx={{ width: 24, height: 24 }}
                        />
                    }
                    title={data.name}
                    titleTypographyProps={{
                        fontSize: "x-large",
                        fontWeight: 700,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography
                        style={{ fontSize: "x-large", margin: "0px 0 20px 0" }}
                    >
                        {CustomFormatter.MarketCapFormatter(
                            parseFloat(data.current_price)
                        ) + " USD"}
                    </Typography>
                </div>
                <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: "small" }}
                >
                    Price
                </Typography>
                {getChangePercentageRow(
                    data.price_change_percentage_24h,
                    "24H"
                )}
                {getChangePercentageRow(data.price_change_percentage_7d, "7D")}
                {getChangePercentageRow(
                    data.price_change_percentage_30d,
                    "30D"
                )}
                <Divider
                    variant="middle"
                    component="li"
                    style={{ listStyle: "none", margin: "10px" }}
                />
                <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: "small" }}
                >
                    Market Cap
                </Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography style={{ margin: 0 }}>Rank</Typography>
                    <Typography style={{ margin: 0, display: "flex" }}>
                        {data.market_cap_rank}
                    </Typography>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography style={{ margin: 0 }}>Market Cap</Typography>
                    <Typography style={{ margin: 0, display: "flex" }}>
                        {CustomFormatter.MarketCapFormatter(
                            parseFloat(data.market_cap)
                        )}
                    </Typography>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography style={{ margin: 0 }}>24H Change</Typography>
                    <Typography
                        style={{
                            margin: 0,
                        }}
                    >
                        {CustomFormatter.MarketCapFormatter(
                            parseFloat(data.market_cap_change_24h)
                        )}
                    </Typography>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {data.market_cap_change_percentage_24h > 0 ? (
                        <Typography
                            style={{
                                margin: 0,
                                color: "green",
                                display: "flex",
                                fontSize: "small",
                            }}
                        >
                            {data.market_cap_change_percentage_24h + " %"}
                        </Typography>
                    ) : (
                        <Typography
                            style={{
                                margin: 0,
                                color: "red",
                                display: "flex",
                                fontSize: "small",
                            }}
                        >
                            {data.market_cap_change_percentage_24h + " %"}
                        </Typography>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default CoinCard;
