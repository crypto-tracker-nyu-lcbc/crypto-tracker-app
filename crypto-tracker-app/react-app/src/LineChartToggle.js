import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function LineChartToggle() {
    const [alignment, setAlignment] = React.useState("left");

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <ToggleButtonGroup
            size="small"
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
        >
            <ToggleButton value="left" aria-label="left aligned">
                24 Hours
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered" disabled>
                7 Days
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" disabled>
                30 Days
            </ToggleButton>
            <ToggleButton value="justify" aria-label="justified" disabled>
                90 Days
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
