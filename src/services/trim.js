import Api from "../Api";

class TrimService {
  getAll(make, model) {
    return Api.get(`/make/${make}/model/${model}/trims`);
  }

  get(make, model) {
    return Api.get(`/make/${make}`);
  }
}

export default new TrimService();