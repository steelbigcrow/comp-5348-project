package com.comp5348.bank.repository;

import com.comp5348.bank.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data Access Object for customer database table.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
