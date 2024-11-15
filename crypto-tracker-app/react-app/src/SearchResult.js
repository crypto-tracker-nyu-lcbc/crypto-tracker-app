import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CoinCard from "./CoinCard";
import LineChartDetail from "./LineChartDetail";
import { Grid2 as Grid, Card, CardHeader } from "@mui/material";
import LineChartToggle from "./LineChartToggle";
function SearchResult() {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");
    const [id, setId] = useState(query);
    useEffect(() => {
        const search = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5001/price?search=${query}`
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.length === 0) {
                    setSearchResults("No results found");
                } else {
                    setSearchResults(JSON.stringify(data));
                }
            } catch (error) {
                setError(error.message || "Something went wrong");
            }
        };

        if (query) {
            setId(query);
            search();
        }
    }, [query]);

    return (
        <div className="SearchResult" style={{ width: "inherit" }}>
            <Grid spacing={2} container className="card-container">
                <CoinCard item id={id} />
                <Card
                    item
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
                        width={700}
                        height={300}
                        color={"red"}
                    />
                </Card>
            </Grid>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* <div>
                <p>{searchResults}</p>
            </div> */}
        </div>
    );
}

export default SearchResult;
