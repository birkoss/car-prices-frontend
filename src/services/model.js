import Api from "../Api";

class ModelService {
  getAll(make) {
    return Api.get(`/make/${make}/models`);
  }

  get(make, model) {
    return Api.get(`/make/${make}/model/${model}`);
  }
}

export default new ModelService();