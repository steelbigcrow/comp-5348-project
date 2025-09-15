package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Payment;
import com.comp5348.practice9.group5.store.model.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PaymentDTO {
    private long id;
    private double amount;
    private PaymentStatus paymentStatus;
    private long transactionRecordId;
    private long fromAccountId;
    private OrderDTO order;

    public PaymentDTO(Payment paymentEntity, boolean includeRelatedEntities) {
        this.id = paymentEntity.getId();
        this.amount = paymentEntity.getAmount();
        this.paymentStatus = paymentEntity.getPaymentStatus();
        this.transactionRecordId = paymentEntity.getTransactionRecordId();
        this.fromAccountId = paymentEntity.getFromAccountId();

        if (includeRelatedEntities) {
            this.order = new OrderDTO(paymentEntity.getOrder());
        }
    }

    public PaymentDTO(Payment paymentEntity) {
        this(paymentEntity, false);  // don't include related entities to avoid infinite recursion
    }
}