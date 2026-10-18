package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Distributed lock manager with safe atomic compare-and-delete semantics.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>SRP (Single Responsibility Principle):</strong> Dedicated exclusively to mutex lease acquisition
 *       and atomic ownership-verified release.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Injects the {@link KeyValueStore} abstraction rather
 *       than concrete Redis driver templates.</li>
 *   <li><strong>LSP (Liskov Substitution Principle):</strong> Completely satisfies the {@link LockService} interface contract.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DistributedLockService implements LockService {

    private final KeyValueStore keyValueStore;

    @Override
    public boolean acquireLock(String lockKey, String lockValue, long expireSeconds) {
        return keyValueStore.setIfAbsent(lockKey, lockValue, Duration.ofSeconds(expireSeconds));
    }

    /**
     * Backward-compatible alias for existing callers/tests.
     */
    public boolean aquireLock(String lockKey, String lockValue, long expireSeconds) {
        return acquireLock(lockKey, lockValue, expireSeconds);
    }

    @Override
    public void releaseLock(String lockKey, String lockValue) {
        if (keyValueStore.compareAndDelete(lockKey, lockValue)) {
            log.info("Successfully released lock for key: {}", lockKey);
        }
    }
}
