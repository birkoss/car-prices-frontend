import Api from "../Api";

class PriceService {
    getAll(trim_id) {
        return Api.get(`/trim/${trim_id}/prices`);
    }

    getAllPending(trim_id) {
        return Api.get(`/trim/${trim_id}/prices/pending`);
    }

    get(trim_id) {
        return Api.get(`/trim/${trim_id}`);
    }
}

export default new PriceService();
