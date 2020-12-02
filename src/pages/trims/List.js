import React from "react";

import { useEffect, useState } from "react";

import TrimService from "../../services/trim";
import MakeService from "../../services/make";
import ModelService from "../../services/model";
import Loading from "../../components/Loading";

import Typography from "@material-ui/core/Typography";

import { Box } from "@material-ui/core";
import TrimPrices from "../../components/TrimPrices";

const TrimsListPage = ({ match }) => {
    const make_slug = match.params.make;
    const model_slug = match.params.model;

    const [isLoading, setLoading] = useState(true);
    const [make, setMake] = useState({});
    const [model, setModel] = useState({});
    const [trims, setTrims] = useState([]);

    useEffect(() => {
        const ac = new AbortController();

        MakeService.get(make_slug)
            .then((response) => {
                setMake(response.data.make);

                ModelService.get(make_slug, model_slug)
                    .then((response) => {
                        setModel(response.data.model);

                        TrimService.getAll(make_slug, model_slug)
                            .then((response) => {
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
            })
            .catch((e) => {
                console.log(e);
            });

        return () => ac.abort();
    }, [make_slug]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h3" component="h1">
                {make.name} {model.name} {model.year}
            </Typography>

            <Box>
                {trims.map((trim) => (
                    <TrimPrices key={trim.slug} trim={trim} />
                ))}
            </Box>
        </div>
    );
};

export default TrimsListPage;
