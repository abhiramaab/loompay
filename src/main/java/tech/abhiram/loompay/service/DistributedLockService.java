package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class DistributedLockService {

    private final KeyValueStore keyValueStore;

    public boolean aquireLock(String lockKey, String lockValue, long expireSeconds) {
        return keyValueStore.setIfAbsent(lockKey, lockValue, Duration.ofSeconds(expireSeconds));
    }

    public void releaseLock(String lockKey, String lockValue) {
        if (keyValueStore.compareAndDelete(lockKey, lockValue)) {
            log.info("Successfully released lock for key: {}", lockKey);
        }
    }
}
