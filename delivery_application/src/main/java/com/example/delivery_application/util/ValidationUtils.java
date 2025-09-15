package com.example.delivery_application.util;

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
}
