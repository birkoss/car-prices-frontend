import Api from "../Api";

class ModelService {
  getAll(make) {
    return Api.get(`/make/${make}/models`);
  }

  get(make, model) {
    return Api.get(`/make/${make}`);
  }
}

export default new ModelService();