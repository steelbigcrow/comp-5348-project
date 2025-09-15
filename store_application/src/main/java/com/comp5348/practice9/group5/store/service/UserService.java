package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.UserDTO;
import com.comp5348.practice9.group5.store.model.User;
import com.comp5348.practice9.group5.store.repository.UserRepository;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /*
    register a new user
     */
    @Transactional
    public ServiceResult<UserDTO> registerUser(String firstName, String lastName, String email, String password) {
        // 1. convert password to hash
        String passwordHash = password.hashCode() + "";
        // 2. check if email is unique
        if (userRepository.existsByEmail(email)) {
            return ServiceResult.failure("Email already exists");
        }
        // 3. save user
        User user = new User(firstName, lastName, email, passwordHash);
        userRepository.save(user);

        return ServiceResult.success(new UserDTO(user));
    }

    /*
    login a user
     */
    @Transactional
    public ServiceResult<UserDTO> loginUser(String email, String password) {
        // 1. get user by email
        Optional<User> user = userRepository.findByEmail(email);
        // 2. check if user exists
        if (user.isEmpty()) {
            return ServiceResult.failure("User not found");
        }
        // 3. check if password is correct
        String passwordHash = password.hashCode() + "";
        if (!passwordHash.equals(user.get().getPasswordHash())) {
            return ServiceResult.failure("Incorrect password");
        }

        return ServiceResult.success(new UserDTO(user.get()));
    }

    /*
    get user info
     */
    @Transactional
    public ServiceResult<UserDTO> getUserInfoById(Long id) {
        // 1. get user by id
        Optional<User> user = userRepository.findById(id);
        // 2. check if user exists
        if (user.isEmpty()) {
            return ServiceResult.failure("User not found");
        }

        return ServiceResult.success(new UserDTO(user.get()));
    }

    /*
    update user info
     */
    @Transactional
    public ServiceResult<UserDTO> updateUser(Long id, String newFirstName, String newLastName, String newPassword) {
        // 1. get user by id
        Optional<User> userOptional = userRepository.findById(id);

        // 2. check if user exists
        if (userOptional.isEmpty()) {
            return ServiceResult.failure("User not found");
        }

        // 3. get user
        User user = userOptional.get();

        // 4. update user info
        user.setFirstName(newFirstName);
        user.setLastName(newLastName);
        user.setPasswordHash(newPassword.hashCode() + "");
        userRepository.save(user);

        return ServiceResult.success(new UserDTO(user));
    }
}
