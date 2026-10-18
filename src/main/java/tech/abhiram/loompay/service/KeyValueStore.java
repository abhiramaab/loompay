package tech.abhiram.loompay.service;

import java.time.Duration;

/**
 * Minimal key/value primitives required by the locking and rate-limiting layers.
 * The Redis implementation is the default; an in-memory implementation is used
 * for the {@code local} profile when Redis is not available.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>OCP (Open/Closed Principle):</strong> Defines an extensible storage abstraction. New caching
 *       backends (e.g., Hazelcast, Memcached, In-Memory test stubs) can be introduced without modifying
 *       locking or rate-limiting engines.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Inverts dependencies so high-level orchestrators
 *       ({@code DistributedLockService}, {@code RateLimiterService}) depend upon this abstraction rather than
 *       concrete Redis driver templates.</li>
 *   <li><strong>ISP (Interface Segregation Principle):</strong> Exposes only atomic primitives necessary for
 *       distributed coordination, avoiding fat generic cache interfaces.</li>
 * </ul>
 */
public interface KeyValueStore {

    /**
     * Atomically set {@code key} to {@code value} only if it is absent.
     *
     * @return true when the key was set by this call
     */
    boolean setIfAbsent(String key, String value, Duration ttl);

    /**
     * Atomically increment the counter stored at {@code key}.
     *
     * @return the value after the increment
     */
    long increment(String key);

    /**
     * Apply a TTL to an existing key. Used to anchor the rate-limit window.
     */
    void expire(String key, Duration ttl);

    String get(String key);

    void delete(String key);

    /**
     * Release a lock only when the caller still owns it.
     *
     * @return true when the lock was removed
     */
    boolean compareAndDelete(String key, String expectedValue);

    /**
     * Sliding window rate limiter check and record.
     *
     * @param key the rate limiting bucket key
     * @param maxRequests maximum allowed requests within the window
     * @param window duration of the sliding window
     * @return true if the request is allowed, false if limit exceeded
     */
    boolean isAllowedSlidingWindow(String key, long maxRequests, Duration window);
}
