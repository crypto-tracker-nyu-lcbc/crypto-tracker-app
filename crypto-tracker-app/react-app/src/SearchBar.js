import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

function SearchBar() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState(""); // Controls input text
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
        const finalQuery = selectedId ? selectedId : query.trim();
        if (finalQuery) {
            navigate(`/search?query=${encodeURIComponent(finalQuery)}`);
        }
    };

    // Extract options for Autocomplete
    const options = data.map((item) => ({ id: item.id, name: item.name }));

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Autocomplete
                freeSolo
                inputValue={query} // Controls the text input value
                options={options}
                getOptionLabel={(option) => option.name || ""}
                disableClearable
                onInputChange={(event, newInputValue) => {
                    setQuery(newInputValue); // Update query text
                    setSelectedId(null); // Reset selected ID when typing
                }}
                onChange={(event, newValue) => {
                    if (newValue) {
                        setQuery(newValue.name); // Set query to selected option's name
                        setSelectedId(newValue.id); // Track the selected option's ID
                    }
                }}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
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
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && query.trim()) {
                                handleSearch(); // Check if query has meaningful content
                            }
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
