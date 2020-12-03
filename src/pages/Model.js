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
    const [ totalPricesPending, setTotalPricesPending ] = useState(0);

    const [validating, setValidating] = useState(false);

    const activatePrices = () => {
        setValidating(true);

        let prices_id = [];
        trims.forEach((trim) => {
            if (trim['prices'] !== undefined && trim['prices']['pending'] !== undefined) {
                prices_id.push(trim['prices']['pending'].id);
            }    
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
            /* Reset prices for all trims */
            trims.forEach((trim) => {
                trim['prices'] = {
                    'pending': null,
                    'active': null
                };
            });

            let total_pending = 0;
            ['pending', 'active'].forEach((type) => {
                response.data.prices[type].forEach((price) => {
                    let trim = trims.find((trim) => trim.id === price.trim.id);
                    if (trim !== undefined) {
                        trim['prices'][type] = price;
                        if (type === "pending") {
                            total_pending++;
                        }
                    }
                });
            });

            setTotalPricesPending(total_pending);
            setLoading(false);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    /* Refresh prices when the trims are updated */
    useEffect(() => {
        if (trims.length > 0) {
            fetchPrices();
        }
    }, [trims])

    useEffect(() => {
        const ac = new AbortController();

        ModelService.get(model_id)
            .then((response) => {
                setModel(response.data.model);

                TrimService.getAll(model_id)
                    .then((response) => {
                        setTrims(response.data.trims);
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

                {totalPricesPending > 0 && !validating && (
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
                    <TrimPrices key={trim.slug} trim={trim} priceActive={trim.prices.active} pricePending={trim.prices.pending} />
                ))}
            </Box>
        </div>
    );
};

export default ModelPage;
