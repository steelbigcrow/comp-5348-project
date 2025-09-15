package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Inventory;
import com.comp5348.practice9.group5.store.model.InventoryTransaction;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class InventoryDTO {
    private long id;
    private int quantity;
    private ProductDTO product;
    private WarehouseDTO warehouse;
    private Set<InventoryTransactionDTO> transactions = new HashSet<>();

    public InventoryDTO(Inventory inventoryEntity, boolean includeRelatedEntities) {
        this.id = inventoryEntity.getId();
        this.quantity = inventoryEntity.getQuantity();

        if (includeRelatedEntities) {
            this.product = new ProductDTO(inventoryEntity.getProduct());
            this.warehouse = new WarehouseDTO(inventoryEntity.getWarehouse());

            // one inventory has multiple inventory transactions
            for (InventoryTransaction inventoryTransaction : inventoryEntity.getInventoryTransactions()) {
                transactions.add(new InventoryTransactionDTO(inventoryTransaction));
            }
        }
    }

    public InventoryDTO(Inventory inventoryEntity) {
        this(inventoryEntity, false);  // don't include related entities to avoid infinite recursion
    }
}