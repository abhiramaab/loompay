package tech.abhiram.loompay.service;

import java.time.Duration;

/**
 * Minimal key/value primitives required by the locking and rate-limiting layers.
 * The Redis implementation is the default; an in-memory implementation is used
 * for the {@code local} profile when Redis is not available.
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
}
