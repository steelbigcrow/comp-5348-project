package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orders") // avoid using database keywords
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    // timestamp of the order
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp;

    // quantity of the order
    @Column(nullable = false)
    @Min(1)
    private int quantity;

    // amount of the order
    @Column(nullable = false)
    private double amount;

    // status of the order
    @Column(nullable = false)
    private OrderStatus orderStatus;

    //status of the delivery
    @Column(nullable = false)
    private DeliveryStatus deliveryStatus;

    // one order has multiple inventory transactions
    @OneToMany(mappedBy = "order")
    private Collection<InventoryTransaction> inventoryTransactions = new ArrayList<>();

    // one user can have multiple orders
    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // one order only has one product
    @ManyToOne
    @JoinColumn(nullable = false)
    private Product product;

    // one order has one payment
    @OneToOne(mappedBy = "order")
    @JoinColumn(nullable = false)
    private Payment payment;

    // constructor: use quantity and product to get the amount of the order
    public Order(Date timestamp, int quantity, User user, Product product) {
        this.timestamp = timestamp;
        this.quantity = quantity;
        this.amount = product.getPrice() * quantity;
        this.orderStatus = OrderStatus.PENDING;
        this.deliveryStatus = DeliveryStatus.EMPTY;
        this.user = user;
        this.product = product;
    }
}
