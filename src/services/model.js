import { Api } from "../Api";

class ModelService {
    getAll(make) {
        return Api.get(`/make/${make}/models`);
    }

    get(model) {
        return Api.get(`/model/${model}`);
    }

    getPrices(model) {
        return Api.get(`/model/${model}/prices`);
    }

    activatePrices(model_id, prices) {
        return Api.put(`/model/${model_id}/prices`, prices);
    }
}

export default new ModelService();
