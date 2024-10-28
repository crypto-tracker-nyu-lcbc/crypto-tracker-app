import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SearchResult() {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

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

        if (query) search();
    }, [query]);

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <p>{searchResults}</p>
            </div>
        </div>
    );
}

export default SearchResult;
