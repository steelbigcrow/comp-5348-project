import http from "../http-common";
import { useNavigate } from 'react-router-dom';

class PaymentService {

    createPayment(userId, orderId, data) {
        return http.post(`/store/users/${userId}/orders/${orderId}/payments`, data);
    }

    cancelPayment(userId, paymentId, orderId) {
        return http.put(`/store/users/${userId}/orders/${orderId}/payments/${paymentId}`)
    }


}

export default new PaymentService();