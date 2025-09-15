package com.comp5348.practice9.group5.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;

/*
    * Entity object for user database table.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users") // avoid using database keywords
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    // store password as a hash
    @Column(nullable = false)
    private String passwordHash;

    // one user can have multiple orders
    @OneToMany(mappedBy = "user")
    private Collection<Order> orders = new ArrayList<>();

    // constructor
    public User(String firstName, String lastName, String email, String passwordHash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}
