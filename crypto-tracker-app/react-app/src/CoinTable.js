import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LineChart from "./LineChart";

const graphWidth = 300;
const rowHeight = 80;

const columns = [
    {
        field: "rank",
        headerName: "#",
        headerClassName: "cointable-header",
        width: 50,
        hideable: false,
    },
    {
        field: "coin",
        headerName: "Coin",
        headerClassName: "cointable-header",
        flex: 1,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
            <CardHeader
                style={{ padding: "0" }}
                avatar={
                    <Avatar
                        alt={params.value.name}
                        src={params.value.image}
                        sx={{ width: 24, height: 24 }}
                    />
                }
                title={params.value.name}
            />
        ),
    },
    {
        field: "current_price",
        headerName: "Current Price",
        headerClassName: "cointable-header",
        type: "number",
        flex: 1,
    },
    {
        field: "price_change_percentage_24h",
        headerName: "24H Change %",
        headerClassName: "cointable-header",
        type: "number",
        flex: 1,
        renderCell: (params) => {
            const change_percentage = parseFloat(params.value);
            return (
                <Typography
                    color={
                        change_percentage < 0 ? "error.light" : "success.light"
                    }
                    fontSize="inherit"
                    fontWeight="700"
                    lineHeight="inherit"
                >
                    {change_percentage} %
                </Typography>
            );
        },
    },
    {
        field: "market_cap",
        headerName: "Market Cap",
        headerClassName: "cointable-header",
        type: "number",
        flex: 1,
    },
    {
        field: "graph",
        headerName: "7-Day Trend",
        headerClassName: "cointable-header",
        type: "number",
        width: 300,
        renderCell: (params) => {
            const change_percentage = parseFloat(
                params.row.price_change_percentage_24h
            );
            // console.log(params.row.sparkline);
            return (
                <LineChart
                    data={params.row.sparkline}
                    id={params.row.id}
                    days="1"
                    width={graphWidth}
                    height={rowHeight}
                    color={change_percentage < 0 ? "red" : "green"}
                />
            );
        },
    },
];

export default function CoinTable() {
    const [data, setData] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const navigate = useNavigate();

    const handleOnRowClick = (params) => {
        navigate(`/search?query=${encodeURIComponent(params.row.id)}`);
    };

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5001/cointable");
            if (!response.ok) throw new Error("response error");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const rows = data;

    return (
        <Paper
            sx={{
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "20px",
                marginBottom: "20px",
                // height: 900,
                width: "90%",
                backgroundColor: "transparent",
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationMode="client"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10]}
                rowHeight={rowHeight}
                onRowClick={handleOnRowClick}
                disableRowSelectionOnClick
                sx={{ color: "white", border: "none" }}
            />
        </Paper>
    );
}
