import { Api } from "../Api";

class MakeService {
    getAll() {
        console.log("GET_ALL()");
        return Api.get("/makes");
    }

    get(slug) {
        return Api.get(`/make/${slug}`);
    }
}

export default new MakeService();
