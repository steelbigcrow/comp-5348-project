package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.Order;
import com.comp5348.practice9.group5.store.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/*
* Data Transfer Object for User.
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
    private Set<OrderDTO> orders = new HashSet<>();

    public UserDTO(User userEntity, boolean includeRelatedEntities) {
        this.id = userEntity.getId();
        this.firstName = userEntity.getFirstName();
        this.lastName = userEntity.getLastName();
        this.email = userEntity.getEmail();
        this.passwordHash = userEntity.getPasswordHash();

        if (includeRelatedEntities) {
            for (Order order : userEntity.getOrders()) {
                orders.add(new OrderDTO(order));
            }
        }
    }

    public UserDTO(User userEntity) {
        this(userEntity, false);  // don't include related entities to avoid infinite recursion
    }
}
