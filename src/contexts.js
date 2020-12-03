import React from "react";

export const UserContextInitialValues = {
    isAuthenticated: false,
    token: "",
};

export const UserContext = React.createContext({
    state: UserContextInitialValues,
    dispatch: () => null,
});

export const UserContextReducer = (
    state,
    action
) => {
    switch (action.type) {
        case "SETDATA":
            return {
                ...state,
                account: action.payload.account,
            };
        case "LOGIN":
            try {
                /* await  AsyncStorage.setItem("token", action.payload.token); */
                console.log("LOGIN: " + action.payload.token);
                localStorage.setItem("api_token", action.payload.token);
            } catch (error) {
                console.log("UserContextReducer/AsyncStorage.setItem", error);
            }

            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
            };
        case "LOGOUT":
            localStorage.removeItem("api_token");
            return {
                ...state,
                isAuthenticated: false,
                token: "",
            };
        default:
            console.log("action.type:" + action.type);
            return state;
    }
};
