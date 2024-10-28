import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

function SearchBar() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState(null);
    const [selectedId, setSelectedId] = useState(null); // Track the selected ID
    const navigate = useNavigate();

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5001/list");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle search
    const handleSearch = () => {
        if (query && query.trim().length > 0) {
            const finalQuery = selectedId ? selectedId : query.trim();
            if (finalQuery) {
                navigate(`/search?query=${encodeURIComponent(finalQuery)}`); // Redirect using the final query
            }
        }
    };

    // Extract options for Autocomplete
    const options = useMemo(
        () => data.map((item) => ({ id: item.id, name: item.name })),
        [data]
    );

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Autocomplete
                freeSolo
                value={query}
                options={options}
                getOptionLabel={(option) => {
                    // Value selected with enter, directly from input
                    if (typeof option === "string") {
                        return option;
                    }
                    // Regular option with an object
                    return option.name;
                }}
                disableClearable
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSearch();
                    }
                }}
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        setQuery(newValue);
                        setSelectedId(null);
                    } else if (newValue) {
                        setQuery(newValue.name); // Set query with the selected name
                        setSelectedId(newValue.id); // Set the selected ID
                    }
                }}
                renderOption={(props, option) => (
                    <li {...props} key={option.id || option.name}>
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Type to search"
                        sx={{ m: 2, width: "500px" }}
                        autoFocus
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                    />
                )}
            />

            <Button variant="contained" onClick={handleSearch} sx={{ m: 2 }}>
                Search
            </Button>
        </div>
    );
}

export default SearchBar;
