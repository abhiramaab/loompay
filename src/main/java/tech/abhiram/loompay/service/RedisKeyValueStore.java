package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@Profile("!local")
@RequiredArgsConstructor
public class RedisKeyValueStore implements KeyValueStore {

    private final StringRedisTemplate redisTemplate;

    @Override
    public boolean setIfAbsent(String key, String value, Duration ttl) {
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(key, value, ttl);
        return Boolean.TRUE.equals(acquired);
    }

    @Override
    public long increment(String key) {
        Long count = redisTemplate.opsForValue().increment(key);
        return count == null ? 0L : count;
    }

    @Override
    public void expire(String key, Duration ttl) {
        redisTemplate.expire(key, ttl);
    }

    @Override
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public boolean compareAndDelete(String key, String expectedValue) {
        String current = redisTemplate.opsForValue().get(key);
        if (expectedValue.equals(current)) {
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }

    @Override
    public boolean isAllowedSlidingWindow(String key, long maxRequests, Duration window) {
        long now = System.currentTimeMillis();
        long windowStart = now - window.toMillis();

        // 1. Remove old timestamps outside the window
        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);

        // 2. Count current elements in window
        Long count = redisTemplate.opsForZSet().zCard(key);
        if (count != null && count >= maxRequests) {
            return false;
        }

        // 3. Add current timestamp (score = timestamp, member = timestamp:nanos or unique value)
        String member = now + ":" + System.nanoTime();
        redisTemplate.opsForZSet().add(key, member, (double) now);
        redisTemplate.expire(key, window);
        return true;
    }
}
