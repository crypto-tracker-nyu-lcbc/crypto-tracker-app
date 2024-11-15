import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { CardHeader, Typography } from "@mui/material";
import { Avatar } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import LineChartDetail from "./LineChartDetail";

function CoinCard(props) {
    const [data, setData] = useState([]);
    const [isBullish, setBool] = useState(false);
    const [img, setImg] = useState(null);
    // Fetch data from the API (only on component mount)
    const fetchData = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/coin-data?id=${props.id}`
            );
            const result = await response.json();
            setData(result);
            setImg(result.image.small);
            result.price_change_24h < 0 ? setBool(false) : setBool(true);
            // console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]); // Set data to empty array on error
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card variant="outlined" style={{ flexGrow: 1, height: props.height }}>
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
                    titleTypographyProps={{ fontSize: "x-large" }}
                />
                {isBullish ? (
                    <Typography
                        sx={{
                            color: "green",
                            fontWeight: "700",
                            display: "flex",
                        }}
                    >
                        {"$ " + data.current_price + " USD"}
                        <ArrowDropUp />
                    </Typography>
                ) : (
                    <Typography
                        sx={{
                            color: "red",
                            fontWeight: "700",
                            display: "flex",
                        }}
                    >
                        {"$ " + data.current_price + " USD"}
                        <ArrowDropDown />
                    </Typography>
                )}

                <Typography variant="body2">
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}
export default CoinCard;
