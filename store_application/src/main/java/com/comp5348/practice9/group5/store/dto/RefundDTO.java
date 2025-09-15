package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Refund;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class RefundDTO {
    private long id;
    private double amount;
    private long transactionRecordId;
    private OrderDTO order;

    public RefundDTO(Refund refundEntity, boolean includeRelatedEntities) {
        this.id = refundEntity.getId();
        this.amount = refundEntity.getAmount();
        this.transactionRecordId = refundEntity.getTransactionRecordId();

        if (includeRelatedEntities) {
            this.order = new OrderDTO(refundEntity.getOrder());
        }
    }

    public RefundDTO(Refund refundEntity) {
        this(refundEntity, false);  // don't include related entities to avoid infinite recursion
    }
}