package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.WarehouseDTO;
import com.comp5348.practice9.group5.store.model.Warehouse;
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
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public WarehouseService(WarehouseRepository warehouseRepository,
                            ProductRepository productRepository,
                            InventoryRepository inventoryRepository,
                            UserRepository userRepository) {
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    /*
    Get all warehouses info
     */
    @Transactional
    public ServiceResult<List<WarehouseDTO>> getAllWarehousesInfo(Long userId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if(userId!=1){
            return ServiceResult.failure("User is not an admin");
        }

        // 3. get all warehouses info
        List<Warehouse> warehouses = warehouseRepository.findAll();

        // 4. convert to DTO and return success
        List<WarehouseDTO> warehouseDTOs = warehouses.stream().map(warehouse -> new WarehouseDTO(warehouse,true)).toList();

        return ServiceResult.success(warehouseDTOs);
    }

    /*
    Get a specific warehouse info
     */
    @Transactional
    public ServiceResult<WarehouseDTO> getWarehouseInfo(Long userId, Long warehouseId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. get a warehouse info
        Optional<Warehouse> warehouse = warehouseRepository.findById(warehouseId);

        // 4. check if the warehouse exists
        if (warehouse.isEmpty()) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 5. convert to DTO and return success
        WarehouseDTO warehouseDTO = new WarehouseDTO(warehouse.get(), true);

        return ServiceResult.success(warehouseDTO);
    }

    /*
    Create a new warehouse
     */
    @Transactional
    public ServiceResult<WarehouseDTO> createWarehouse(Long userId, String name, String address) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. create a new warehouse
        Warehouse warehouse = new Warehouse(name, address);
        warehouseRepository.save(warehouse);

        return ServiceResult.success(new WarehouseDTO(warehouse));
    }

    /*
    Update a warehouse
     */
    @Transactional
    public ServiceResult<WarehouseDTO> updateWarehouse(Long userId, Long warehouseId, String name, String address) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. get the warehouse
        Optional<Warehouse> warehouseOptional = warehouseRepository.findById(warehouseId);

        // 4. check if the warehouse exists
        if (warehouseOptional.isEmpty()) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 5. get the warehouse object
        Warehouse warehouse = warehouseOptional.get();

        // 5. update the warehouse
        warehouse.setName(name);
        warehouse.setAddress(address);
        warehouseRepository.save(warehouse);

        return ServiceResult.success(new WarehouseDTO(warehouse));
    }

    /*
    delete a warehouse
     */
    @Transactional
    public ServiceResult<String> deleteWarehouse(Long userId, Long warehouseId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. check if the user is an admin
        if (userId != 1) {
            return ServiceResult.failure("User is not an admin");
        }

        // 3. get the warehouse
        Optional<Warehouse> warehouseOptional = warehouseRepository.findById(warehouseId);

        // 4. check if the warehouse exists
        if (warehouseOptional.isEmpty()) {
            return ServiceResult.failure("Warehouse not found");
        }

        // 5. get the warehouse object
        Warehouse warehouse = warehouseOptional.get();

        // 6. delete the warehouse
        warehouseRepository.delete(warehouse);

        // 7. delete all inventories of the warehouse
        inventoryRepository.deleteByWarehouseId(warehouseId);

        return ServiceResult.success("Warehouse and its inventories deleted");
    }
}
