package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private double amount;

    // one refund corresponds to one order
    @OneToOne
    @JoinColumn(nullable = false)
    private Order order;

    // one refund corresponds to one transaction record
    // store only the transactionRecordId to decouple from the Bank Application
    @Column(nullable = false)
    private long transactionRecordId;

    // constructor
    public Refund(double amount, Order order, long transactionRecordId) {
        this.amount = amount;
        this.order = order;
        this.transactionRecordId = transactionRecordId;
    }
}