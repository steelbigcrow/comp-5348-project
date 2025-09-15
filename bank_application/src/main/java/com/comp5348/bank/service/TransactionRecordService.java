package com.comp5348.bank.service;

import com.comp5348.bank.dto.TransactionRecordDTO;
import com.comp5348.bank.dto.SimpleTransactionRecordDTO;
import com.comp5348.bank.errors.InsufficientBalanceException;
import com.comp5348.bank.errors.NegativeTransferAmountException;
import com.comp5348.bank.model.Account;
import com.comp5348.bank.model.TransactionRecord;
import com.comp5348.bank.repository.AccountRepository;
import com.comp5348.bank.repository.CustomerRepository;
import com.comp5348.bank.repository.TransactionRecordRepository;
import com.comp5348.bank.util.ServiceResult;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

/**
 * Business logic for creating and managing transactions (transfer / deposit).
 */
@Service
public class TransactionRecordService {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRecordRepository transactionRecordRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public TransactionRecordService(AccountRepository accountRepository, CustomerRepository customerRepository, TransactionRecordRepository transactionRecordRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.transactionRecordRepository = transactionRecordRepository;
    }

    @Transactional
    public TransactionRecordDTO performTransaction(
            Long fromCustomerId, Long fromAccountId,
            Long toCustomerId, Long toAccountId,
            Double amount, String memo)
            throws InsufficientBalanceException, HttpClientErrorException {
        if (amount <= 0) {
            throw new NegativeTransferAmountException();
        }

        Account fromAccount = null;
        if (fromAccountId != null) {
            fromAccount = accountRepository
                    .findByIdAndCustomer(fromAccountId, customerRepository.getReferenceById(fromCustomerId))
                    .orElseThrow();
            entityManager.refresh(fromAccount);

            if (fromAccount.getBalance() < amount) {
                throw new InsufficientBalanceException();
            }
            fromAccount.modifyBalance(-amount);
            accountRepository.save(fromAccount);
        }
        Account toAccount = null;
        if (toAccountId != null) {
            toAccount = accountRepository
                    .findByIdAndCustomer(toAccountId, customerRepository.getReferenceById(toCustomerId))
                    .orElseThrow();
            toAccount.modifyBalance(amount);
            accountRepository.save(toAccount);
        }

        TransactionRecord transactionRecord = new TransactionRecord(amount, toAccount, fromAccount, memo);
        transactionRecordRepository.save(transactionRecord);

        return new TransactionRecordDTO(transactionRecord);
    }

    @Transactional
    public ServiceResult<SimpleTransactionRecordDTO> performSimpleTransaction(Long fromAccountId, Long toAccountId, Double amount, String memo) {
        // 1. check if the amount is positive
        if (amount <= 0) {
            return ServiceResult.failure("Amount must be positive.");
        }

        // 2. check if the fromAccount exists
        if(!accountRepository.existsById(fromAccountId)) {
            return ServiceResult.failure("From account not found.");
        }

        // 3. check if the toAccount exists
        if(!accountRepository.existsById(toAccountId)) {
            return ServiceResult.failure("To account not found.");
        }

        // 4. check if the fromAccount has enough balance
        Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow();
        entityManager.refresh(fromAccount);
        if (fromAccount.getBalance() < amount) {
            return ServiceResult.failure("Insufficient balance.");
        }

        // 5. modify the fromAccount balance
        fromAccount.modifyBalance(-amount);
        accountRepository.save(fromAccount);

        // 5. modify the toAccount balance
        Account toAccount = accountRepository.findById(toAccountId).orElseThrow();
        toAccount.modifyBalance(amount);
        accountRepository.save(toAccount);

        // 6. save the transaction record
        TransactionRecord transactionRecord = new TransactionRecord(amount, toAccount, fromAccount, memo);
        transactionRecordRepository.save(transactionRecord);

        // 7. return success
        return ServiceResult.success(new SimpleTransactionRecordDTO(transactionRecord.getId()));
    }
}
