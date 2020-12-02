import React, { useState } from "react";

import { Box, Grid, Paper } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from "@material-ui/core/Typography";

import SwipeableTabs from "./SwipeableTabs";
import Loading from "./Loading";

import PriceService from "../services/price";

const TrimPrices = (props) => {
    const { trim } = props;

    const [ isExpanded, setExpanded ] = useState(false);
    const [ isLoading, setLoading ] = useState(true);
    const [ pricesActive, setPricesActive ] = useState(null);
    const [ pricesPending, setPricesPending ] = useState(null);

    const showPrice = (prices, type) => {
        let price = null;
        if (prices[type] !== undefined) {
            price = prices[type];
        }

        if (price === null) {
            return (<h6>Nothing</h6>)    
        }

        console.log(price);

        return (<h1>{type}</h1>)
    }

    const toggleTabs = () => {
        setExpanded(!isExpanded);

        if (pricesActive === null && pricesPending === null) {
            console.log("OK");
            setLoading(true);

            PriceService.getAll(trim.id)
                .then((response) => {
                    setPricesActive(response.data.prices);

                    PriceService.getAllPending(trim.id)
                        .then((response) => {
                            setPricesPending(response.data.prices);
                            setLoading(false);
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    return (
        <Box key={trim.slug}>
            <Paper
                variant="outlined"
                style={{ padding: "20px", marginTop: "20px" }}
            >
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" onClick={() => toggleTabs()}>
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

                {isExpanded && isLoading && (
                    <Loading inside={true} />
                )}

                {isExpanded && !isLoading && (
                    <SwipeableTabs>
                        <Box tab="Cash">
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    {showPrice(pricesActive, "cash")}
                                </Grid>
                                <Grid item xs>
                                    {showPrice(pricesPending, "cash")}
                                </Grid>
                            </Grid>
                        </Box>
                        <Box tab="Lease">
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    {showPrice(pricesActive, "lease")}
                                </Grid>
                                <Grid item xs>
                                    {showPrice(pricesPending, "lease")}
                                </Grid>
                            </Grid>
                        </Box>
                        <Box tab="Finance">
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    {showPrice(pricesActive, "finance")}
                                </Grid>
                                <Grid item xs>
                                    {showPrice(pricesPending, "finance")}
                                </Grid>
                            </Grid>
                        </Box>
                    </SwipeableTabs>
                )}
            </Paper>
        </Box>
    );
};
export default TrimPrices;
