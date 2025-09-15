package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // find all orders by user id
    List<Order> findAllByUser_Id(Long userId);

    // find all orders by product id
    List<Order> findAllByProduct_Id(Long productId);
}
