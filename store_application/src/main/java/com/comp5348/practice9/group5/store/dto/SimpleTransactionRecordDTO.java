package com.comp5348.practice9.group5.store.dto;

import lombok.Data;

/**
 * minimal DTO for TransactionRecord, used only to store ID
 */
@Data
public class SimpleTransactionRecordDTO {
    private Long id;

    public SimpleTransactionRecordDTO(Long id) {
        this.id = id;
    }
}
