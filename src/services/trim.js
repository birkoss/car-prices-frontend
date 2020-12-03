import { Api } from "../Api";

class TrimService {
    getAll(model_id) {
        return Api.get(`/model/${model_id}/trims`);
    }

    get(trim_id) {
        return Api.get(`/trim/${trim_id}`);
    }
}

export default new TrimService();
