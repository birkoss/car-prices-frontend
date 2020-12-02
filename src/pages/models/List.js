import { useEffect, useState } from "react";

import ModelService from "../../services/model";
import MakeService from "../../services/make";
import Loading from "../../components/Loading";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TrimsListPage from "../trims/List";

import styles from "./List.module.css";
import { Box, Link } from "@material-ui/core";

const ModelsListPage = ({ match }) => {
    const make_slug = match.params.make;

    const [appState, setAppState] = useState({
        loading: true,
        make: {},
        models: [],
    });

    const groupModelsPerYear = (models) => {
        let grouped_models = [];

        models.forEach((model) => {
            let grouped_model = grouped_models.find(
                (m) => m.name === model.name
            );

            if (grouped_model === undefined) {
                grouped_model = {
                    name: model.name,
                    years: [],
                };
                grouped_models.push(grouped_model);
            }

            grouped_model["years"].push(model);
        });

        return grouped_models;
    };

    useEffect(() => {
        const ac = new AbortController();

        MakeService.get(make_slug)
            .then((response) => {
                const make = response.data.make;
                ModelService.getAll(make_slug)
                    .then((response) => {
                        setAppState({
                            make: make,
                            loading: false,
                            models: groupModelsPerYear(response.data.models),
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

    if (appState.loading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>{appState.make.name}</h1>

            <Box display="flex" flexWrap="wrap">
                {appState.models.map((model) => (
                    <Card
                        className={styles.model}
                        key={model.name}
                        variant="outlined"
                    >
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {model.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {model.years.map((year) => (
                                <Button href={"/make/" + appState.make.slug + "/trim/" + year.slug} key={year.slug} size="small">
                                    {year.year}
                                </Button>
                            ))}
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </div>
    );
};

export default ModelsListPage;
