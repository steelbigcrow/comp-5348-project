package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.InventoryDTO;
import com.comp5348.practice9.group5.store.model.Inventory;
import com.comp5348.practice9.group5.store.repository.InventoryRepository;
import com.comp5348.practice9.group5.store.repository.ProductRepository;
import com.comp5348.practice9.group5.store.repository.UserRepository;
import com.comp5348.practice9.group5.store.repository.WarehouseRepository;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final UserRepository userRepository;

    @Autowired
    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            WarehouseRepository warehouseRepository,
                            UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.userRepository = userRepository;
    }

    /*
    Get all inventory info
     */
    @Transactional
    public ServiceResult<List<InventoryDTO>> getAllInventoryInfo(Long userId, Long warehouseId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the warehouse exists
        if (!warehouseRepository.existsById(warehouseId)) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 3. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 4. get all inventory info
        List<Inventory> inventories = inventoryRepository.findByWarehouseId(warehouseId);

        // 5. convert to DTO and return success
        List<InventoryDTO> inventoryDTOs = inventories.stream().map(inventory -> new InventoryDTO(inventory,true)).toList();

        return ServiceResult.success(inventoryDTOs);
    }

    /*
    Get a specific inventory info
     */
    @Transactional
    public ServiceResult<InventoryDTO> getInventoryInfo(Long userId, Long warehouseId, Long inventoryId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the warehouse exists
        if (!warehouseRepository.existsById(warehouseId)) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 3. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 4. get a specific inventory info
        Optional<Inventory> inventoryOptional = inventoryRepository.findById(inventoryId);

        // 5. check if the inventory exists
        if (inventoryOptional.isEmpty()) {
            return ServiceResult.failure("Inventory not found");
        }

        // 6. convert to DTO and return success
        InventoryDTO inventoryDTO = new InventoryDTO(inventoryOptional.get(), true);

        return ServiceResult.success(inventoryDTO);
    }

    /*
    Create a new inventory
     */
    @Transactional
    public ServiceResult<InventoryDTO> createInventory(Long userId, Long warehouseId, long productId, int quantity) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the warehouse exists
        if (!warehouseRepository.existsById(warehouseId)) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 3. check if the product exists
        if (!productRepository.existsById(productId)) {
            return ServiceResult.failure("Product not found");
        }

        // 4. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 5. create a new inventory
        Inventory inventory = new Inventory();
        inventory.setQuantity(quantity);
        inventory.setProduct(productRepository.getReferenceById(productId));
        inventory.setWarehouse(warehouseRepository.getReferenceById(warehouseId));
        inventoryRepository.save(inventory);

        // 6. convert to DTO and return success
        InventoryDTO inventoryDTO = new InventoryDTO(inventory, true);

        return ServiceResult.success(inventoryDTO);
    }

    /*
    Update a specific inventory
     */
    @Transactional
    public ServiceResult<InventoryDTO> updateInventory(Long userId, Long warehouseId, Long inventoryId, int quantity) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the warehouse exists
        if (!warehouseRepository.existsById(warehouseId)) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 3. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 4. get a specific inventory info
        Optional<Inventory> inventoryOptional = inventoryRepository.findById(inventoryId);

        // 5. check if the inventory exists
        if (inventoryOptional.isEmpty()) {
            return ServiceResult.failure("Inventory not found");
        }

        // 6. update the inventory
        Inventory inventory = inventoryOptional.get();
        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);

        // 7. convert to DTO and return success
        InventoryDTO inventoryDTO = new InventoryDTO(inventory, true);

        return ServiceResult.success(inventoryDTO);
    }
}
