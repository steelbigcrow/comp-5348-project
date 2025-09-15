package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    // check if email is unique
    boolean existsByEmail(String email);
    // find user by email
    Optional<User> findByEmail(String email);

}