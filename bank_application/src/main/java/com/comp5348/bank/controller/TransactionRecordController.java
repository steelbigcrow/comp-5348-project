package com.comp5348.bank.controller;

import com.comp5348.bank.dto.SimpleTransactionRecordDTO;
import com.comp5348.bank.dto.TransactionRecordDTO;
import com.comp5348.bank.service.TransactionRecordService;
import com.comp5348.bank.util.ServiceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/bank/customers/{fromCustomerId}/accounts/{accountId}/transaction_records")
public class TransactionRecordController {

    private final TransactionRecordService transactionRecordService;

    @Autowired
    public TransactionRecordController(TransactionRecordService transactionRecordService) {
        this.transactionRecordService = transactionRecordService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@PathVariable Long fromCustomerId, @PathVariable("accountId") Long fromAccountId, @RequestBody TransferRequest request) {
        // 1. if fromCustomerId is not provided
        if (fromCustomerId <= 0) { //
            // 1.1 call the service to perform the simple transaction
            ServiceResult<SimpleTransactionRecordDTO> result = transactionRecordService
                    .performSimpleTransaction(fromAccountId, request.toAccountId, request.amount, "Transfer.");

            // 1.2 handle result
            if (!result.isSuccess()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
            }

            return ResponseEntity.status(HttpStatus.OK).body(Map.of("id", result.getData().getId()));
        }
        // 2. if fromCustomerId is provided
        else {
            TransactionRecordDTO transactionRecord = transactionRecordService
                    .performTransaction(fromCustomerId, fromAccountId,
                            request.toCustomerId, request.toAccountId, request.amount, "Transfer.");

            return ResponseEntity.ok(transactionRecord);
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@PathVariable("fromCustomerId") Long toCustomerId,
                                     @PathVariable("accountId") Long toAccountId,
                                     @RequestBody DepositWithdrawRequest request) {
        TransactionRecordDTO transactionRecord = transactionRecordService
                .performTransaction(null, null,
                        toCustomerId, toAccountId,
                        request.amount, "Deposit.");
        return ResponseEntity.ok(transactionRecord);
    }

    public static class TransferRequest {
        public long toCustomerId;
        public long toAccountId;
        public double amount;
    }

    public static class DepositWithdrawRequest {
        public double amount;
    }
}
