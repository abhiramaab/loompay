package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Sliding-window request rate limiter.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>SRP (Single Responsibility Principle):</strong> Focused strictly on measuring request frequencies
 *       and enforcing sliding-window throttling policies per tenant/merchant.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Relies on the {@link KeyValueStore} interface for state storage.</li>
 * </ul>
 */
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
