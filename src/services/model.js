import Api from "../Api";

class ModelService {
  getAll(make) {
    return Api.get(`/make/${make}/models`);
  }

  get(model) {
    return Api.get(`/model/${model}`);
  }
}

export default new ModelService();