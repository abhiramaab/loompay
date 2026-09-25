package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class DistributedLockService {

    private final StringRedisTemplate redisTemplate;

    public boolean aquireLock(String lockKey, String lockValue, long expireSeconds){
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue, Duration.ofSeconds(expireSeconds)
        );
        return Boolean.TRUE.equals(acquired);
    }

    public void releaseLock(String lockKey, String lockValue){
        String currentValue = redisTemplate.opsForValue().get(lockKey);
        if (lockValue.equals(currentValue)){
            redisTemplate.delete(lockKey);
            log.info("Successfully released lock for key: {}", lockKey);
        }
    }
}
