package com.example.delivery_application.service;

import com.example.delivery_application.dto.DeliveryDTO;
import com.example.delivery_application.model.Delivery;
import com.example.delivery_application.model.DeliveryStatus;
import com.example.delivery_application.repository.DeliveryRepository;
import com.example.delivery_application.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public DeliveryService(DeliveryRepository deliveryRepository, RestTemplate restTemplate) {
        this.deliveryRepository = deliveryRepository;
        this.restTemplate = restTemplate;
    }

    /*
    Get a delivery info
     */
    @Transactional
    public ServiceResult<DeliveryDTO> getDeliveryInfo(Long deliveryId) {
        // 1. get a delivery info
        Optional<Delivery> delivery = deliveryRepository.findById(deliveryId);

        // 2. check if the delivery exists
        if (delivery.isEmpty()) {
            return ServiceResult.failure("Delivery not found");
        }

        return ServiceResult.success(new DeliveryDTO(delivery.get()));
    }

    /*
    create a delivery
     */
    @Transactional
    public ServiceResult<DeliveryDTO> createDelivery(Long orderId, Integer quantity, String address, String email) {
        // 1. create a delivery
        Delivery delivery = new Delivery(orderId, DeliveryStatus.SETUP, new Date(), quantity, address, email);
        // 2. save the delivery
        deliveryRepository.save(delivery);

        // 3. start the delivery procedure

        // 3.1 create a scheduler
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        // 3.2 wait for 20 seconds to complete the delivery pickup
        scheduler.schedule(() -> {
            // get the delivery
            Optional<Delivery> deliverySetupOptional = deliveryRepository.findByOrderId(orderId);

            // check if the delivery exists
            if (deliverySetupOptional.isEmpty()) {
                scheduler.shutdown();
                return;
            }

            Delivery deliverySetup = deliverySetupOptional.get();

            // check if the delivery is cancelled
            if (deliverySetup.getStatus() == DeliveryStatus.CANCELLED) {
                scheduler.shutdown();
                return;
            }

            // update the order
            updateOrder(orderId, DeliveryStatus.PICKUP);

            // update the delivery
            deliverySetup.setStatus(DeliveryStatus.PICKUP);
            String accident = "Null";
            if (Math.random() < 0.5) {
                accident = "Lost 5% of the products";
                deliverySetup.setQuantity((int) (deliverySetup.getQuantity() * 0.95));
            }
            deliveryRepository.save(deliverySetup);

            // create an email
            createEmail((int) deliverySetup.getId(), email, DeliveryStatus.PICKUP.ordinal(), address, accident);


            // 3.3 wait for an additional 5 seconds to complete the delivering
            scheduler.schedule(() -> {
                // get the delivery
                Optional<Delivery> deliveryPickupOptional = deliveryRepository.findByOrderId(orderId);

                // check if the delivery exists
                if (deliveryPickupOptional.isEmpty()) {
                    scheduler.shutdown();
                    return;
                }

                Delivery deliveryPickup = deliveryPickupOptional.get();

                // update the order
                updateOrder(orderId, DeliveryStatus.DELIVERING);

                // update the delivery
                deliveryPickup.setStatus(DeliveryStatus.DELIVERING);
                String accidentDelivering = "Null";
                if (Math.random() < 0.5) {
                    accidentDelivering = "Lost 5% of the products";
                    deliveryPickup.setQuantity((int) (deliveryPickup.getQuantity() * 0.95));
                }
                deliveryRepository.save(deliveryPickup);

                // create an email
                createEmail((int) deliveryPickup.getId(), email, DeliveryStatus.DELIVERING.ordinal(), address, accidentDelivering);


                // 3.4 wait for an additional 5 seconds to complete the delivery
                scheduler.schedule(() -> {
                    // get the delivery
                    Optional<Delivery> deliveryDeliveringOptional = deliveryRepository.findByOrderId(orderId);

                    // check if the delivery exists
                    if (deliveryDeliveringOptional.isEmpty()) {
                        scheduler.shutdown();
                        return;
                    }

                    Delivery deliveryDelivering = deliveryDeliveringOptional.get();

                    // update the order
                    updateOrder(orderId, DeliveryStatus.COMPLETED);

                    // update the delivery
                    deliveryDelivering.setStatus(DeliveryStatus.COMPLETED);
                    String accidentCompleted = "Null";
                    if (Math.random() < 0.5) {
                        accidentCompleted = "Lost 5% of the products";
                        deliveryDelivering.setQuantity((int) (deliveryDelivering.getQuantity() * 0.95));
                    }
                    deliveryRepository.save(deliveryDelivering);

                    // create an email
                    createEmail((int) deliveryDelivering.getId(), email, DeliveryStatus.COMPLETED.ordinal(), address, accidentCompleted);

                    scheduler.shutdown();
                }, 5, TimeUnit.SECONDS);

            }, 5, TimeUnit.SECONDS);

        }, 20, TimeUnit.SECONDS);

        return ServiceResult.success(new DeliveryDTO(delivery));
    }

    /*
    update order
     */
    public ServiceResult<DeliveryStatus> updateOrder(Long orderId, DeliveryStatus deliveryStatus) {
        // 1. use HTTP request to update a order
        String website = "http://localhost:8080/";
        String url = website + "/store/users/-1/orders/" + orderId;

        // 2. create a request body
        UpdateOrderRequest updateOrderRequest = new UpdateOrderRequest(deliveryStatus.ordinal());
        HttpEntity<UpdateOrderRequest> requestEntity = new HttpEntity<>(updateOrderRequest);

        // 3. send HTTP request to update the order
        try{
            // 4. send the PUT request and get the response
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, new ParameterizedTypeReference<>() {});

            // 5. if the update succeeded

            // 5.1 check if the response body is empty
            if (response.getBody() == null) {
                return ServiceResult.failure("Wrong bank response");
            }

            // 5.2 cast the response body to a map
            Map<String, Integer> responseBody = response.getBody();

            return ServiceResult.success(DeliveryStatus.values()[responseBody.get("status")]);

        } catch (HttpClientErrorException.BadRequest e) { // business logic error
            return ServiceResult.failure("Order update failed due to business logic error");
        }
        catch (Exception e) { // system error
            return ServiceResult.failure("Order update failed due to system error");
        }
    }

    /*
    Update order request body
     */
    @Transactional
    public static class UpdateOrderRequest {
        public Integer deliveryStatus;
        // constructor
        public UpdateOrderRequest(Integer deliveryStatus) {
            this.deliveryStatus = deliveryStatus;
        }
    }

    /*
    create email
     */
    public ServiceResult<DeliveryStatus> createEmail(Integer deliverId, String email, Integer deliveryStatus, String address, String accident) {
        // 1. use HTTP request to create an email
        String website = "http://localhost:8083/";
        String url = website + "/email/emails";

        // 2. create a request body
        CreateEmailRequest createEmailRequest = new CreateEmailRequest(deliverId, email, deliveryStatus, address, accident);
        HttpEntity<CreateEmailRequest> requestEntity = new HttpEntity<>(createEmailRequest);

        // 3. send HTTP request to create an email
        try {
            // 4. send the POST request and get the response
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

            // 5. if the creation succeeded

            // 5.1 check is the response body is empty
            if (response.getBody() == null) {
                return ServiceResult.failure("Wrong email response");
            }

            // 5.2 cast the response body to a map
            Map<String, Integer> responseBody = response.getBody();

            return ServiceResult.success(DeliveryStatus.values()[responseBody.get("status")]);

        } catch (HttpClientErrorException.BadRequest e){ // business logic error
            return ServiceResult.failure("Email creation failed due to business logic error");
        }
        catch (Exception e) { // system error
            return ServiceResult.failure("Email creation failed due to system error");
        }
    }

    /*
    create email request body
     */
    public static class CreateEmailRequest {
        public Integer deliveryId;
        public String emailAddress;
        public Integer deliveryStatus;
        public String address;
        public String accident;

        // constructor
        public CreateEmailRequest(Integer deliveryId, String emailAddress, Integer deliveryStatus, String address, String accident) {
            this.deliveryId = deliveryId;
            this.emailAddress = emailAddress;
            this.deliveryStatus = deliveryStatus;
            this.address = address;
            this.accident = accident;
        }
    }

    /*
    Update a delivery
     */
    @Transactional
    public ServiceResult<DeliveryDTO> updateDelivery(Long deliveryId, DeliveryStatus status, int quantity) {
        // 1. get a delivery info
        Optional<Delivery> delivery = deliveryRepository.findById(deliveryId);

        // 2. check if the delivery exists
        if (delivery.isEmpty()) {
            return ServiceResult.failure("Delivery not found");
        }

        // 3. get the delivery object
        Delivery deliveryObject = delivery.get();

        // 3. update the delivery
        deliveryObject.setStatus(status);
        deliveryObject.setQuantity(quantity);
        deliveryRepository.save(delivery.get());

        return ServiceResult.success(new DeliveryDTO(delivery.get()));
    }

    /*
    Cancel a delivery
     */
    @Transactional
    public ServiceResult<DeliveryDTO> cancelDelivery(Long orderId) {
        // 1. get a delivery info
        Optional<Delivery> deliveryOptional = deliveryRepository.findByOrderId(orderId);

        // 2. check if the delivery exists
        if (deliveryOptional.isEmpty()) {
            return ServiceResult.failure("Delivery not found");
        }

        // 3. get the delivery
        Delivery delivery = deliveryOptional.get();

        // 3. check if the delivery is cancelable
        if (delivery.getStatus().ordinal() != 1) {
            return ServiceResult.failure("Delivery is not cancelable");
        }

        // 4. update the delivery
        delivery.setStatus(DeliveryStatus.CANCELLED);
        deliveryRepository.save(delivery);

        return ServiceResult.success(new DeliveryDTO(delivery));
    }
}
