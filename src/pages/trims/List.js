import { useEffect, useState } from "react";

import TrimService from "../../services/trim";
import Loading from "../../components/Loading";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Box } from "@material-ui/core";

const TrimsListPage = ({ match }) => {
    const make = match.params.make;
    const model = match.params.model;

    const [appState, setAppState] = useState({
        loading: true,
        trims: [],
    });


    useEffect(() => {
        const ac = new AbortController();

        TrimService.getAll(make, model)
            .then((response) => {
                setAppState({
                    loading: false,
                    trims: response.data.trims,
                });
            })
            .catch((e) => {
                console.log(e);
            });

        return () => ac.abort();
    }, [make]);

    if (appState.loading) {
        return <Loading />;
    }

    console.log(appState.trims);

    return (
        <div style={{ padding: "20px" }}>
            <h1>{make} {model}</h1>

            <Box display="flex" flexWrap="wrap">
                {appState.trims.map((trim) => (
                    <Card
                        key={trim.slug}
                        variant="outlined"
                    >
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {trim.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                           
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </div>
    );
};

export default TrimsListPage;
