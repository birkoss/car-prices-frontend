import React, { useContext, useState } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import UserService from "../services/user";

import { UserContext } from "../contexts";

import styles from "./Login.module.css";

const LoginPage = () => {
    const { dispatch } = useContext(UserContext);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    const login = () => {
        UserService.login(email, password)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.token !== "") {
                        dispatch({
                            type: "LOGIN",
                            payload: {
                                token: response.data.token,
                            },
                        });
                    }
                }
            })
            .catch((e) => {
                setError("Invalid email or password");
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={styles.container}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <FormControl className={styles.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={styles.submit}
                        onClick={login}
                    >
                        Sign In
                    </Button>
                    {error !== "" && (
                        <p style={{color: "red"}}>{error}</p>
                    )}
                </FormControl>
            </div>
        </Container>
    );
};

export default LoginPage;
