import { Api } from "../Api";

class PriceService {
    getAll(trim_id) {
        return Api.get(`/trim/${trim_id}/prices`);
    }
}

export default new PriceService();
