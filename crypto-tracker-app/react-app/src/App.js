import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Menu from "./Menu";
import SearchResult from "./SearchResult";
import Home from "./Home";

const theme = createTheme({
    // backgroundColor: "#1b2139",
    // color: "#a4edf0",
    palette: {
        primary: {
            main: "#102ff8",
        },
        secondary: {
            main: "#ff5903",
        },
    },
    typography: {
        fontFamily: "Space Grotesk",
    },
    // palette: {
    //     primary: "#1095ba",
    //     secondary: "#e67488",
    // },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Menu />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResult />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
