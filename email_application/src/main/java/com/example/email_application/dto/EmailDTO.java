package com.example.email_application.dto;

import com.example.email_application.model.DeliveryStatus;
import com.example.email_application.model.Email;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/*
 * Data Transfer Object for email
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EmailDTO {
    private long id;
    private long deliveryId;
    private String emailAddress;
    private String description;
    private Date timestamp;
    private DeliveryStatus status;
    private String address;

    //constructor
    public EmailDTO(Email emailEntity) {
        this.id = emailEntity.getId();
        this.deliveryId = emailEntity.getDeliveryId();
        this.emailAddress = emailEntity.getEmailAddress();
        this.description = emailEntity.getDescription();
        this.timestamp = emailEntity.getTimestamp();
        this.status = emailEntity.getStatus();
        this.address = emailEntity.getAddress();
    }

}
