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
        boolean allowed = keyValueStore.isAllowedSlidingWindow(
                key,
                MAX_REQUESTS,
                Duration.ofSeconds(WINDOW_SECONDS)
        );

        if (!allowed) {
            log.warn("Rate limit exceeded for merchant: {}", merchantId);
        }
        return allowed;
    }
}
