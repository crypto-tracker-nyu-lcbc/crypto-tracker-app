import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
        renderCell: (params) => {
            return (
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
            );
        },
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
        headerName: "24h",
        headerClassName: "cointable-header",
        type: "number",
        flex: 1,
        renderCell: (params) => {
            var change_percentage = parseFloat(params.value);
            return change_percentage < 0 ? (
                <Typography
                    color="error.light"
                    fontSize="inherit"
                    fontWeight="700"
                    lineHeight="inherit"
                >
                    {change_percentage} %
                </Typography>
            ) : (
                <Typography
                    color="success.light"
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
        headerName: "Graph",
        headerClassName: "cointable-header",
        type: "number",
        flex: 1,
    },
];

// const paginationModel = { page: 0, pageSize: 100 };

export default function CoinTable() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const handleOnRowClick = (params) => {
        var id = params.row.id;
        // console.log(symbol);
        navigate(`/search?query=${encodeURIComponent(id)}`);
    };
    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5001/top100");
            if (!response.ok) {
                throw new Error("response error");
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
    const rows = data;
    return (
        <Paper
            sx={{
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "20px",
                height: 1000,
                width: "90%",
                backgroundColor: "transparent",
            }}
        >
            <DataGrid
                rowHeight={80}
                rows={rows}
                columns={columns}
                // initialState={{ pagination: { paginationModel } }}
                onRowClick={handleOnRowClick}
                hideFooterPagination
                disableRowSelectionOnClick
                sx={{ color: "white", border: "None" }}
            />
        </Paper>
    );
}
