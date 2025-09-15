package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.InventoryStatus;
import com.comp5348.practice9.group5.store.model.InventoryTransaction;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class InventoryTransactionDTO {
    private long id;
    private int quantity;
    private InventoryStatus status;
    private InventoryDTO inventory;
    private OrderDTO order;

    public InventoryTransactionDTO(InventoryTransaction inventoryTransactionEntity, boolean includeRelatedEntities) {
        this.id = inventoryTransactionEntity.getId();
        this.quantity = inventoryTransactionEntity.getQuantity();
        this.status = inventoryTransactionEntity.getStatus();

        if(includeRelatedEntities) {
            this.inventory = new InventoryDTO(inventoryTransactionEntity.getInventory());
            this.order = new OrderDTO(inventoryTransactionEntity.getOrder());
        }
    }

    public InventoryTransactionDTO(InventoryTransaction inventoryTransactionEntity) {
        this(inventoryTransactionEntity, false);  // don't include related entities to avoid infinite recursion
    }
}
