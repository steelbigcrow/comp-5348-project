package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private InventoryStatus status;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Inventory inventory;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Order order;

    // constructor
    public InventoryTransaction(int quantity, InventoryStatus status, Inventory inventory, Order order) {
        this.quantity = quantity;
        this.status = status;
        this.inventory = inventory;
        this.order = order;
    }
}
