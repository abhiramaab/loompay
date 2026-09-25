package tech.abhiram.loompay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.abhiram.loompay.entity.OutboxEvent;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    List<OutboxEvent> findByStatus(String status, Pageable pageable);
}
