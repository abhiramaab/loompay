package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    private static final long MAX_REQUESTS = 5;
    private static final long WINDOW_SECONDS = 10;

    public boolean isAllowed(String merchantId) {
        String key = "rate:merchant:" + merchantId;

        Long currentCount = redisTemplate.opsForValue().increment(key);

        if (currentCount != null && currentCount == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(WINDOW_SECONDS));
        }

        if (currentCount != null && currentCount > MAX_REQUESTS) {
            log.warn("Rate limit exceeded for merchant; {}. Current count: {}", merchantId, currentCount);
            return false;
        }
        return true;
    }
}
