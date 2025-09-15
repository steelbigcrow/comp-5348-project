package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Inventory;
import com.comp5348.practice9.group5.store.model.Warehouse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class WarehouseDTO {
    private long id;
    private String name;
    private String address;
    private Set<InventoryDTO> inventories = new HashSet<>();

    public WarehouseDTO(Warehouse warehouseEntity, boolean includeRelatedEntities) {
        this.id = warehouseEntity.getId();
        this.name = warehouseEntity.getName();
        this.address = warehouseEntity.getAddress();

        if (includeRelatedEntities) {
            for (Inventory inventory : warehouseEntity.getInventories()) {
                inventories.add(new InventoryDTO(inventory));
            }
        }
    }

    public WarehouseDTO(Warehouse warehouseEntity) {
        this(warehouseEntity, false);  // don't include related entities to avoid infinite recursion
    }
}