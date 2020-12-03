import { Api } from "../Api";

class MakeService {
    getAll() {
        return Api.get("/makes");
    }

    get(slug) {
        return Api.get(`/make/${slug}`);
    }
}

export default new MakeService();
