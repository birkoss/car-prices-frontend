import axios from "axios";
export const Api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-type": "application/json",
        Authorization: "Token " + process.env.REACT_APP_API_TOKEN,
    },
});

Api.interceptors.request.use(
    function (config) {

        const token = localStorage.getItem("api_token") || ""
        if (token !== "") {
            config.headers["Authorization"] = "Token " + token;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

