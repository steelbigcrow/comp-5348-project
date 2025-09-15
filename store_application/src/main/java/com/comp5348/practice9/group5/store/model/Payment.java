package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private double amount;

    // payment status
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    // one payment corresponds to one order
    @OneToOne
    @JoinColumn(nullable = false)
    private Order order;

    // one payment corresponds to one transaction record
    @Column(nullable = false)
    private long transactionRecordId;

    // one payment corresponds to one user account ID
    @Column(nullable = false)
    private long fromAccountId;

    // constructor
    public Payment(double amount, PaymentStatus paymentStatus, Order order, long transactionRecordId, long fromAccountId) {
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.order = order;
        this.transactionRecordId = transactionRecordId;
        this.fromAccountId = fromAccountId;
    }
}