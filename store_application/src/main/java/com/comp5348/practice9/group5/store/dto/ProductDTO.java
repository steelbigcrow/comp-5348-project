package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Inventory;
import com.comp5348.practice9.group5.store.model.Order;
import com.comp5348.practice9.group5.store.model.Product;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ProductDTO {
    private long id;
    private String name;
    private String description;
    private double price;
    private Set<OrderDTO> orders = new HashSet<>();
    private Set<InventoryDTO> inventories = new HashSet<>();

    public ProductDTO(Product productEntity, boolean includeRelatedEntities) {
        this.id = productEntity.getId();
        this.name = productEntity.getName();
        this.description = productEntity.getDescription();
        this.price = productEntity.getPrice();

        if (includeRelatedEntities) {
            for (Order order : productEntity.getOrders()) {
                orders.add(new OrderDTO(order));
            }
            for (Inventory inventory : productEntity.getInventories()) {
                inventories.add(new InventoryDTO(inventory));
            }
        }
    }

    public ProductDTO(Product productEntity) {
        this(productEntity, false);  // don't include related entities to avoid infinite recursion
    }
}