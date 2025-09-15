import http from "../http-common";
import { useNavigate } from 'react-router-dom';

class ProductService {
    // Get all employees
    update(id, data) {
        return http.put(`/store/users/${id}/info/update`, data);
    }

    // Get a single employee by ID
    getProductList() {
        return http.get(`/store/users/-1/products`);
    }

    login(data) {
        return http.post(`/store/users/login`, data);
    }

    // Create a new employee
    create(data) {
        console.log("Customer Data");
        //alert(data);
        return http.post("/store/users/register", data);
    }


}

export default new ProductService();