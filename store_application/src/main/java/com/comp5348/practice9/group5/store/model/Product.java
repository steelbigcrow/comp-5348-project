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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double price;

    // one product can have multiple orders
    @OneToMany(mappedBy = "product")
    private Collection<Order> orders = new ArrayList<>();

    // one product can have multiple inventories
    @OneToMany(mappedBy = "product")
    private Collection<Inventory> inventories = new ArrayList<>();

    // constructor
    public Product(String name, String description, double price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}