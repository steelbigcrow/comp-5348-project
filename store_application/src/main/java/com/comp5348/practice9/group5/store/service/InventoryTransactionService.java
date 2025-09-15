package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.InventoryTransactionDTO;
import com.comp5348.practice9.group5.store.model.*;
import com.comp5348.practice9.group5.store.repository.InventoryRepository;
import com.comp5348.practice9.group5.store.repository.InventoryTransactionRepository;
import com.comp5348.practice9.group5.store.repository.OrderRepository;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryTransactionService {
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public InventoryTransactionService(InventoryTransactionRepository inventoryTransactionRepository,
                                       InventoryRepository inventoryRepository,
                                       OrderRepository orderRepository) {
        this.inventoryTransactionRepository = inventoryTransactionRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
    }

    /*
    get all inventory transactions by order id
     */
    @Transactional
    public ServiceResult<List<InventoryTransactionDTO>> getInventoryTransactionsByOrderId(Long orderId) {
        // 1. check if the order exists
        if (!orderRepository.existsById(orderId)) {
            return ServiceResult.failure("Order not found");
        }

        // 2. get all inventory transactions by order id
        List<InventoryTransaction> inventoryTransactions = inventoryTransactionRepository.findByOrderId(orderId);

        // 3. convert to DTO and return success
        List<InventoryTransactionDTO> inventoryTransactionDTOs = inventoryTransactions.stream().
                map(InventoryTransaction -> new InventoryTransactionDTO(InventoryTransaction,true)).toList();

        return ServiceResult.success(inventoryTransactionDTOs);
    }

    /*
    get all inventory transactions by inventory id
     */
    @Transactional
    public ServiceResult<List<InventoryTransactionDTO>> getInventoryTransactionsByInventoryId(Long inventoryId) {
        // 1. check if the inventory exists
        if (!inventoryRepository.existsById(inventoryId)) {
            return ServiceResult.failure("Inventory not found");
        }

        // 2. get all inventory transactions by inventory id
        List<InventoryTransaction> inventoryTransactions = inventoryTransactionRepository.findByInventoryId(inventoryId);

        // 3. convert to DTO and return success
        List<InventoryTransactionDTO> inventoryTransactionDTOs = inventoryTransactions.stream().
                map(InventoryTransaction -> new InventoryTransactionDTO(InventoryTransaction, true)).toList();

        return ServiceResult.success(inventoryTransactionDTOs);
    }

    /*
    launch a consolidation
     */
    @Transactional
    public ServiceResult<List<InventoryTransactionDTO>> launchConsolidation(Long userId, Long orderId) {
        // 1. get order
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        // 2. check if the order exists
        if (orderOptional.isEmpty()) {
            return ServiceResult.failure("Order not found");
        }

        // 3. get order object
        Order order = orderOptional.get();

        // 4. check if the user is the owner of the order
        if (!(order.getUser().getId() == (userId))) {
            return ServiceResult.failure("User is not the owner of the order");
        }

        // 5. get product object
        Product product = order.getProduct();

        // 6. get the inventories
        List<Inventory> inventories = inventoryRepository.findByProductId(product.getId());

        // 7. make sure the total quantity of the inventories can meet the order
        int totalQuantity = inventories.stream().mapToInt(Inventory::getQuantity).sum();
        if (totalQuantity < order.getQuantity()) {
            return ServiceResult.failure("Inventories cannot meet the order");
        }

        // 8. modify the inventories

        // 8.1 sort the inventories by quantity in descending order
        inventories.sort(Comparator.comparingInt(Inventory::getQuantity).reversed());

        // 8.2 remove the inventories until the total quantity can meet the order: also need to update the inventory transactions
        int remainingQuantity = order.getQuantity();
        List<InventoryTransaction> inventoryTransactions = new ArrayList<>();
        for (Inventory inventory : inventories) {
            // if the inventory can meet the remaining quantity
            if (inventory.getQuantity() >= remainingQuantity) {
                // update the inventory
                inventory.setQuantity(inventory.getQuantity() - remainingQuantity);
                inventoryRepository.save(inventory);

                // create an inventory transaction
                InventoryTransaction inventoryTransaction = new InventoryTransaction(remainingQuantity, InventoryStatus.DISPATCHED, inventory, order);
                inventoryTransactionRepository.save(inventoryTransaction);

                // add the inventory transaction to the list
                inventoryTransactions.add(inventoryTransaction);

                break;
            } else { // if the inventory cannot meet the remaining quantity
                // update the inventory
                int quantity = inventory.getQuantity();
                remainingQuantity -= quantity;
                inventory.setQuantity(0);
                inventoryRepository.save(inventory);

                // create an inventory transaction
                InventoryTransaction inventoryTransaction = new InventoryTransaction(quantity, InventoryStatus.DISPATCHED, inventory, order);
                inventoryTransactionRepository.save(inventoryTransaction);

                // add the inventory transaction to the list
                inventoryTransactions.add(inventoryTransaction);
            }
        }

        // 9. convert to DTO
        List<InventoryTransactionDTO> inventoryTransactionDTOs = inventoryTransactions.stream().map(InventoryTransactionDTO::new).toList();

        return ServiceResult.success(inventoryTransactionDTOs);
    }

    /*
    restore inventories by inventory transactions
     */
    @Transactional
    public ServiceResult<List<InventoryTransactionDTO>> restoreInventories(Long orderId){
        // 1. get all inventory transactions by order id
        List<InventoryTransaction> inventoryTransactions = inventoryTransactionRepository.findByOrderId(orderId);

        // 1.1 check if the inventory transactions exist
        if (inventoryTransactions.isEmpty()) {
            return ServiceResult.failure("Inventory transactions not found");
        }

        // 2. restore the inventories and update the inventory transactions
        for (InventoryTransaction inventoryTransaction : inventoryTransactions) {
            // 2.1 restore the inventory
            Inventory inventory = inventoryTransaction.getInventory();
            inventory.setQuantity(inventory.getQuantity() + inventoryTransaction.getQuantity());
            inventoryRepository.save(inventory);

            // 2.2 update the inventory transaction
            inventoryTransaction.setStatus(InventoryStatus.RECEIVED);
            inventoryTransactionRepository.save(inventoryTransaction);
        }

        // 3. convert to DTO
        List<InventoryTransactionDTO> inventoryTransactionDTOs = inventoryTransactions.stream().map(InventoryTransactionDTO::new).toList();

        return ServiceResult.success(inventoryTransactionDTOs);
    }
}
