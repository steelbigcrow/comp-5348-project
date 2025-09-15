package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.ProductDTO;
import com.comp5348.practice9.group5.store.model.Product;
import com.comp5348.practice9.group5.store.repository.ProductRepository;
import com.comp5348.practice9.group5.store.repository.UserRepository;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /*
    Get all products info
     */
    @Transactional
    public ServiceResult<List<ProductDTO>> getAllProductsInfo(Long userId) {
        // 1. check if the user login
        if (userId!=-1) { // if user login
            // 1.1 check if the user exists
            if (!userRepository.existsById(userId)) {
                return ServiceResult.failure("User not found");
            }
        }

        // 2. get all products info
        List<Product> products = productRepository.findAll();

        // 3. convert to DTO and return success
        List<ProductDTO> productDTOs = products.stream().map(ProductDTO::new).toList();

        return ServiceResult.success(productDTOs);
    }

    /*
    Get a specific product info
     */
    @Transactional
    public ServiceResult<ProductDTO> getProductInfo(Long userId, Long productId) {
        // 1. check if the user login
        if (userId!=-1) { // if user login
            // 1.1 check if the user exists
            if (!userRepository.existsById(userId)) {
                return ServiceResult.failure("User not found");
            }
        }

        // 2. get a product info
        Optional<Product> product = productRepository.findById(productId);

        // 3. check if the product exists
        if (product.isEmpty()) {
            return ServiceResult.failure("Product not found");
        }

        // 4. return product DTO on success
        return ServiceResult.success(new ProductDTO(product.get()));
    }

    /*
    Create a product
     */
    @Transactional
    public ServiceResult<ProductDTO> createProduct(Long userId, String name, String description, double price) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId!=1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. create a product
        Product product = new Product(name, description, price);
        productRepository.save(product);

        return ServiceResult.success(new ProductDTO(product));
    }

    /*
    update a product
     */
    @Transactional
    public ServiceResult<ProductDTO> updateProduct(Long userId, Long productId, String name, String description, double price) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. check if the product exists
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty()) {
            return ServiceResult.failure("Product not found");
        }

        // 4. get the product
        Product product = productOptional.get();

        // 5. update the product
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        productRepository.save(product);

        return ServiceResult.success(new ProductDTO(product));
    }

    /*
    Delete a product
     */
    @Transactional
    public ServiceResult<ProductDTO> deleteProduct(Long userId, Long productId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. check if the product exists
        if (!productRepository.existsById(productId)) {
            return ServiceResult.failure("Product not found");
        }

        // 4. delete the product
        productRepository.deleteById(productId);

        return ServiceResult.success(null);
    }
}
