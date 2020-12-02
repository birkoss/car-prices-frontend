import { useEffect, useState } from "react";

import ModelService from "../../services/model";
import MakeService from "../../services/make";
import Loading from "../../components/Loading";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import styles from "./List.module.css";
import { Box } from "@material-ui/core";

const ModelsListPage = ({ match }) => {
    const make_slug = match.params.make;

    const [isLoading, setLoading] = useState(true);
    const [make, setMake] = useState({});
    const [models, setModels] = useState([]);

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
                setMake(response.data.make);

                ModelService.getAll(make_slug)
                    .then((response) => {
                        setModels(groupModelsPerYear(response.data.models));
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
    }, [make_slug]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>{make.name}</h1>

            <Box display="flex" flexWrap="wrap">
                {models.map((model) => (
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
                                <Button href={"/make/" + make.slug + "/trim/" + year.slug} key={year.slug} size="small">
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
