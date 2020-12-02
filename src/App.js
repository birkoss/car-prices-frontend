import { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";

import { AppBar, Toolbar, Typography } from "@material-ui/core";

import HomePage from "./pages/Home";
import ModelsListPage from "./pages/models/List";

import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

import MakeService from "./services/make";
import TrimsListPage from "./pages/trims/List";

function App() {
    const [appState, setAppState] = useState({
        loading: true,
        makes: [],
    });

    useEffect(() => {
      console.log("FETCHING makes");
        const ac = new AbortController();
        setAppState({ loading: true });

        MakeService.getAll()
            .then((response) => {
                setAppState({ loading: false, makes: response.data.makes });
            })
            .catch((e) => {
                console.log(e);
            });

        return () => ac.abort(); // Abort both fetches on unmount
    }, [setAppState]);

    if (appState.loading) {
        return <Loading />;
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Car Prices</Typography>
                    <Navbar makes={appState.makes} />
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/make/:make/trim/:model" component={TrimsListPage} />
                <Route path="/make/:make" component={ModelsListPage} />
                <Route path="/about" component={HomePage} />
            </Switch>
        </div>
    );
}

export default App;
