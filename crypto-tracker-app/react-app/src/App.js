import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/search" element={<SearchResult />} />
                <Route path="/" element={<SearchBar />} />
            </Routes>
        </div>
    );
}

export default App;
