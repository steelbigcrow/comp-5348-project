package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.UserDTO;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import com.comp5348.practice9.group5.store.service.UserService;
import com.comp5348.practice9.group5.store.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/store/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request) {

        // 1. check validation

        // 1.1 check if first name is empty
        if (request.firstName == null || request.firstName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "First name cannot be empty"));

        }
        // 1.2 check if last name is empty
        if (request.lastName == null || request.lastName.isEmpty()) {

            System.out.println(request.lastName);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Last name cannot be empty"));

        }
        // 1.3 check if email is valid
        if (!ValidationUtils.isValidEmail(request.email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));

        }
        // 1.4 check if password is valid
        if (!ValidationUtils.isValidPassword(request.password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid password format"));

        }

        // 2. call service to register user
        ServiceResult<UserDTO> result = userService.registerUser(request.firstName, request.lastName, request.email, request.password);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserRequest request) {
        // 1. check validation

        // 1.1 check if email is valid
        if (!ValidationUtils.isValidEmail(request.email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));
        }
        // 1.2 check if password is valid
        if (!ValidationUtils.isValidPassword(request.password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid password format"));
        }

        // 2. call service to login user
        ServiceResult<UserDTO> result = userService.loginUser(request.email, request.password);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    @GetMapping("/{userId}/info")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        // 1. call service to get user info
        ServiceResult<UserDTO> result = userService.getUserInfoById(userId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    @PutMapping("/{userId}/info/update")
    public ResponseEntity<?> updateUserInfo(@PathVariable Long userId, @RequestBody UpdateUserInfoRequest request) {
        // 1. check validation

        // 1.1 check if first name is empty
        if (request.firstName == null || request.firstName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "First name cannot be empty"));
        }
        // 1.2 check if last name is empty
        if (request.lastName == null || request.lastName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Last name cannot be empty"));
        }
        // 1.3 check if password is valid
        if (!ValidationUtils.isValidPassword(request.password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid password format"));
        }

        // 2. call service to update user info
        ServiceResult<UserDTO> result = userService.updateUser(userId, request.firstName, request.lastName, request.password);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    public static class RegisterUserRequest {
        public String firstName;
        public String lastName;
        public String email;
        public String password;
    }

    public static class LoginUserRequest {
        public String email;
        public String password;
    }

    public static class UpdateUserInfoRequest {
        public String firstName;
        public String lastName;
        public String password;
    }
}
