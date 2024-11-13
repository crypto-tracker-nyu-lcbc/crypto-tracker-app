import React from "react";
import "./App.css";
import SearchBar from "./SearchBar";
import CoinTable from "./CoinTable";
function Home() {
    return (
        <div>
            <SearchBar />
            <CoinTable />
        </div>
    );
}

export default Home;
