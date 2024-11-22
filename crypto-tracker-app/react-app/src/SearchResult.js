import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CoinCard from "./CoinCard";
import LineChartDetail from "./LineChartDetail";
import { Grid2 as Grid, Card } from "@mui/material";
import LineChartToggle from "./LineChartToggle";
function SearchResult() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");
    const [id, setId] = useState(query);
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        if (query) {
            setId(query);
        }

        // Cleanup the event listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, [query]);

    return (
        <div className="SearchResult" style={{ width: "inherit" }}>
            <Grid spacing={2} container className="card-container">
                <CoinCard id={id} minWidth={250} />
                <Card
                    style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                    }}
                >
                    <LineChartToggle />

                    <LineChartDetail
                        id={id}
                        days="1"
                        width={
                            windowSize.width < "1026"
                                ? windowSize.width * 0.75
                                : windowSize.width * 0.5
                        }
                        height={300}
                    />
                </Card>
            </Grid>
            {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
            {/* <div>
                <p>{searchResults}</p>
            </div> */}
        </div>
    );
}

export default SearchResult;
