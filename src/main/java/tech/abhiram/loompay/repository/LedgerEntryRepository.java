package tech.abhiram.loompay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.abhiram.loompay.entity.LedgerEntry;

import java.util.List;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {

    List<LedgerEntry> findByPaymentOrderId(String paymentOrderId);
    List<LedgerEntry> findByAccount(String account);
}
