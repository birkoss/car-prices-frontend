import { Api } from "../Api";

class UserService {
    login(email, password) {
        return Api.post(`/login`, {
            email,
            password
        });
    }
}

export default new UserService();
