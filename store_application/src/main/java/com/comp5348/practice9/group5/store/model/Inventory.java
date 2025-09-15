package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private int quantity;

    // one inventory has multiple inventory transactions
    @OneToMany(mappedBy = "inventory")
    private Collection<InventoryTransaction> inventoryTransactions = new ArrayList<>();

    // one inventory corresponds to one product
    @ManyToOne
    @JoinColumn(nullable = false)
    private Product product;

    // one inventory corresponds to one warehouse
    @ManyToOne
    @JoinColumn(nullable = false)
    private Warehouse warehouse;

    // constructor
    public Inventory(int quantity, Product product, Warehouse warehouse) {
        this.quantity = quantity;
        this.product = product;
        this.warehouse = warehouse;
    }
}