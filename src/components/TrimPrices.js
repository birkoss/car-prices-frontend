import React, { useState } from "react";

import { Box, Grid, Paper } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Typography from "@material-ui/core/Typography";

import SwipeableTabs from "./SwipeableTabs";

const TrimPrices = (props) => {
    const { trim } = props;

    const [isExpanded, setExpanded] = useState(false);

    return (
        <Box key={trim.slug}>
            <Paper
                variant="outlined"
                style={{ padding: "20px", marginTop: "20px" }}
            >
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" onClick={() => setExpanded(!isExpanded)}>
                        {isExpanded && (
                            <ExpandMoreIcon />
                        )}
                        {!isExpanded && (
                            <NavigateNextIcon />
                        )}
                    </IconButton>
                    <Typography variant="h4" key={trim.slug} component="h2">
                        {trim.name}
                    </Typography>
                </Toolbar>

                {isExpanded && (
                    <SwipeableTabs>
                        <Box tab="Cash">
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    Current
                                </Grid>
                                <Grid item xs>
                                    Pending
                                </Grid>
                            </Grid>
                        </Box>
                        <Box tab="Lease">Lease info</Box>
                        <Box tab="Finance">Finance info</Box>
                    </SwipeableTabs>
                )}
            </Paper>
        </Box>
    );
};
export default TrimPrices;
