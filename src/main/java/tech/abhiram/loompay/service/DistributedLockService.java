package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

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
