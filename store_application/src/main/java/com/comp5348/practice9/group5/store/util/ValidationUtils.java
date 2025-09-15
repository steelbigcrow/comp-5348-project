package com.comp5348.practice9.group5.store.util;

import java.util.regex.Pattern;

public class ValidationUtils {
    private static final String emailRegex = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
    private static final String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,16}$";

    public static boolean isValidEmail(String email) {
        return email != null && !email.isEmpty() && Pattern.matches(emailRegex, email);
    }

    // at least 8 characters, at most 16 characters, at least one uppercase letter, one lowercase letter, and one number
    public static boolean isValidPassword(String password) {
        return password != null && !password.isEmpty() && Pattern.matches(passwordRegex, password);
    }

    public static boolean isValidUserId(Long userId) {
        return userId != null && (userId == -1 || userId >= 1);
    }

    public static boolean isValidProductId(Long productId) {
        return productId != null && productId >= 1;
    }

    public static boolean isValidWarehouseId(Long warehouseId) {
        return warehouseId != null && warehouseId >= 1;
    }
}
