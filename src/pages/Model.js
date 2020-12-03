import React from "react";

import { useEffect, useState } from "react";

import TrimService from "../services/trim";
import MakeService from "../services/make";
import ModelService from "../services/model";
import Loading from "../components/Loading";

import Typography from "@material-ui/core/Typography";

import { Box, Button, CircularProgress, Grid, Toolbar } from "@material-ui/core";
import TrimPrices from "../components/TrimPrices";
import Filler from "../components/Filler";

const ModelPage = ({ match }) => {
    const model_id = match.params.model;

    const [isLoading, setLoading] = useState(true);
    const [model, setModel] = useState({});
    const [trims, setTrims] = useState([]);
    const [prices, setPrices] = useState(null);

    const [validating, setValidating] = useState(false);

    const activatePrices = () => {
        setValidating(true);

        let prices_id = [];
        prices['pending'].forEach(price => {
            prices_id.push(price.id);
        });

        ModelService.activatePrices(model_id, {'prices': prices_id})
            .then((response) => {
                fetchPrices();
                setValidating(false);
            })
            .catch((e) => {
                setValidating(false);
            });
    }

    const fetchPrices = () => {
        ModelService.getPrices(model_id)
        .then((response) => {
            setPrices(response.data.prices);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        const ac = new AbortController();

        ModelService.get(model_id)
            .then((response) => {
                setModel(response.data.model);

                TrimService.getAll(model_id)
                    .then((response) => {
                        fetchPrices();
                        setTrims(response.data.trims);
                        setLoading(false);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });

        return () => ac.abort();
    }, [model_id]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Toolbar>
                <Typography variant="h3" component="h1">
                    {model.make.name} {model.name} {model.year}
                </Typography>

                <Filler />

                {prices !== null && prices['pending'].length > 0 && !validating && (
                    <Button disabled={validating} variant="contained" color="primary" onClick={activatePrices}>
                        Approuve all prices
                    </Button>
                )}

                {validating && (
                    <CircularProgress />
                )}
            </Toolbar>

            <Box>
                {trims.map((trim) => (
                    <TrimPrices key={trim.slug} trim={trim} />
                ))}
            </Box>
        </div>
    );
};

export default ModelPage;
