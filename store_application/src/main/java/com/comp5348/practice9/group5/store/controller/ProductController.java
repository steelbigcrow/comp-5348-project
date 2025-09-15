package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.ProductDTO;
import com.comp5348.practice9.group5.store.service.ProductService;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import com.comp5348.practice9.group5.store.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/store/users/{userId}/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /*
    Get all products info
     */
    @GetMapping
    public ResponseEntity<?> getAllProductsInfo(@PathVariable Long userId) {
        // 1. check validation

        // 1.1 check if userId valid
        if(!ValidationUtils.isValidUserId(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid userId"));
        }

        // 2. call service to get all products info
        ServiceResult<List<ProductDTO>> result = productService.getAllProductsInfo(userId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Get a specific product info
     */
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductInfo(@PathVariable Long userId, @PathVariable Long productId) {
        // 1. check validation

        // 1.1 check if userId valid
        if(!ValidationUtils.isValidUserId(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid userId"));
        }

        // 1.2 check if productId valid
        if(!ValidationUtils.isValidProductId(productId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid productId"));
        }

        // 2. call service to get a product info
        ServiceResult<ProductDTO> result = productService.getProductInfo(userId, productId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Create a product in store
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@PathVariable Long userId, @RequestBody ProductRequest request) {
        // 1. check validation

        // 1.1 check if userId valid
        if(!ValidationUtils.isValidUserId(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid userId"));
        }

        // 1.2 check if name, description, and price valid
        if(request.name == null || request.name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid name"));
        }
        if(request.description == null || request.description.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid description"));
        }
        if(request.price == null || request.price < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid price"));
        }

        // 2. call service to add a product
        ServiceResult<ProductDTO> result = productService.createProduct(userId, request.name, request.description, request.price);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Update a specific product in store
     */
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long userId, @PathVariable Long productId, @RequestBody ProductRequest request) {
        // 1. check validation

        // 1.1 check if userId valid
        if(!ValidationUtils.isValidUserId(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid userId"));
        }

        // 1.2 check if productId valid
        if(!ValidationUtils.isValidProductId(productId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid productId"));
        }

        // 1.3 check if name, description, and price valid
        if(request.name == null || request.name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid name"));
        }
        if(request.description == null || request.description.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid description"));
        }
        if(request.price == null || request.price < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid price"));
        }

        // 2. call service to update a product
        ServiceResult<ProductDTO> result = productService.updateProduct(userId, productId, request.name, request.description, request.price);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Delete a specific product from store
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long userId, @PathVariable Long productId) {
        // 1. check validation

        // 1.1 check if userId valid
        if(!ValidationUtils.isValidUserId(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid userId"));
        }

        // 1.2 check if productId valid
        if(!ValidationUtils.isValidProductId(productId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid productId"));
        }

        // 2. call service to delete a product
        ServiceResult<ProductDTO> result = productService.deleteProduct(userId, productId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }


    public static class ProductRequest {
        public String name;
        public String description;
        public Double price;
    }
}
