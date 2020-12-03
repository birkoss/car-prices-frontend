import { useEffect, useReducer, useState } from "react";
import { Switch, Route } from "react-router-dom";

import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';

import HomePage from "./pages/Home";
import MakePage from "./pages/Make";
import ModelPage from "./pages/Model";

import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

import MakeService from "./services/make";

import {
    UserContext,
    UserContextInitialValues,
    UserContextReducer,
} from "./contexts";

import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const [ isLoading, setLoading ] = useState(true);

    const [appState, setAppState] = useState({
        loading: true,
        makes: [],
    });

    const [state, dispatch] = useReducer(
        UserContextReducer,
        UserContextInitialValues
    );

    const fetchMakes = () => {
        console.log("FETCHING makes");
        const ac = new AbortController();
        setAppState({ loading: true });

        MakeService.getAll()
            .then((response) => {
                setAppState({ loading: false, makes: response.data.makes });
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });

        return () => ac.abort(); // Abort both fetches on unmount
    };

    const getTokenFromStorage = () => {
        try {
            const token = localStorage.getItem("api_token") || "";
            if (token !== "") {
                dispatch({
                    type: "LOGIN",
                    payload: {
                        token,
                    },
                });
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        dispatch({
            type: "LOGOUT",
        });
    };

    useEffect(() => {
        getTokenFromStorage();
        console.log("useEffect[]");
    }, []);

    useEffect(() => {
        console.log("useEffect - state.token" + state.token);
        if (state.token !== "") {
            fetchMakes();
        }
    }, [state.token]);

    if (isLoading) {
        return <Loading />;
    }

    console.log(state.isAuthenticated, isLoading);

    return (
        <div className="App">
            <UserContext.Provider value={{ state, dispatch }}>
                {!state.isAuthenticated && (
                    <LoginPage />
                )}

                {state.isAuthenticated && (
                    <>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">Car Prices</Typography>
                        <Navbar makes={appState.makes} />
                        <div style={{flexGrow: 1}} />
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/model/:model" component={ModelPage} />
                    <Route path="/make/:make" component={MakePage} />
                    <Route component={NotFoundPage} />
                </Switch>
                    </>
                )}
            </UserContext.Provider>
        </div>
    );
}

export default App;
