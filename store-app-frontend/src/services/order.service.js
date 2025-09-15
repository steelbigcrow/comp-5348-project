import http from "../http-common";
import { useNavigate } from 'react-router-dom';

class OrderService {
    // Get all employees
    update(id, data) {
        return http.put(`/store/users/${id}/info/update`, data);
    }

    // Get a single employee by ID
    getOrderList() {
        return http.get(`/store/users/-1/products`);
    }

    getOrderListByUser(id) {
        return http.get(`/store/users/${id}/orders`);
    }

    login(data) {
        return http.post(`/store/users/login`, data);
    }

    // Create a new employee
    create(id, data) {
        //alert(data);
        return http.post(`/store/users/${id}/orders`, data);
    }


}

export default new OrderService();