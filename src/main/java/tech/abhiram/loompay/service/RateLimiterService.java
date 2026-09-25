package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class RateLimiterService {

    private final KeyValueStore keyValueStore;

    private static final long MAX_REQUESTS = 5;
    private static final long WINDOW_SECONDS = 10;

    public boolean isAllowed(String merchantId) {
        String key = "rate:merchant:" + merchantId;

        long currentCount = keyValueStore.increment(key);

        if (currentCount == 1) {
            keyValueStore.expire(key, Duration.ofSeconds(WINDOW_SECONDS));
        }

        if (currentCount > MAX_REQUESTS) {
            log.warn("Rate limit exceeded for merchant; {}. Current count: {}", merchantId, currentCount);
            return false;
        }
        return true;
    }
}
