import React, { useState } from "react";

import { Box, Grid, Paper } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";

import SwipeableTabs from "./SwipeableTabs";
import Loading from "./Loading";

import { formatPrice } from "../helpers";

import PriceService from "../services/price";
import Calculator from "./Calculator";

const TrimPrices = (props) => {
    const { trim } = props;

    const [isExpanded, setExpanded] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [pricesActive, setPricesActive] = useState(null);
    const [pricesPending, setPricesPending] = useState(null);

    const showPrice = (prices, type) => {
        let price = null;
        if (prices !== null && prices["data"][type] !== undefined) {
            price = prices["data"][type];
        }

        if (price === null) {
            return <h6>Nothing</h6>;
        }

        return (
            <Box>
                <Calculator msrp={prices.msrp} fees={prices.taxes} delivery={prices.delivery} prices={price} type={type} />
            </Box>
        );
    };

    const toggleTabs = () => {
        setExpanded(!isExpanded);

        if (pricesActive === null && pricesPending === null) {
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
    };

    const tabs = [
        {
            name: "Lease",
            api_key: "lease",
        },
        {
            name: "Finance",
            api_key: "finance",
        },
        {
            name: "Cash",
            api_key: "cash",
        },
    ];

    return (
        <Box key={trim.slug}>
            <Paper
                variant="outlined"
                style={{ padding: "20px", marginTop: "20px" }}
            >
                <Toolbar variant="dense">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => toggleTabs()}
                    >
                        {isExpanded && <ExpandMoreIcon />}
                        {!isExpanded && <NavigateNextIcon />}
                    </IconButton>
                    <Typography variant="h4" key={trim.slug} component="h2">
                        {trim.name}
                    </Typography>
                </Toolbar>

                {isExpanded && isLoading && <Loading inside={true} />}

                {isExpanded && !isLoading && (
                    <SwipeableTabs>
                        {tabs.map((tab) => (
                            <Box tab={tab.name} key={tab.api_key}>
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Typography variant="h5" component="h3">
                                            Active
                                        </Typography>
                                        {showPrice(pricesActive, tab.api_key)}
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h5" component="h3">
                                            Pending
                                        </Typography>
                                        {showPrice(pricesPending, tab.api_key)}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </SwipeableTabs>
                )}
            </Paper>
        </Box>
    );
};
export default TrimPrices;
