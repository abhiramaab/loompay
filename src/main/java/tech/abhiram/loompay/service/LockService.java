package tech.abhiram.loompay.service;

/**
 * Abstraction for distributed locking mechanisms (DIP & ISP).
 */
public interface LockService {

    /**
     * Attempts to acquire a distributed lock.
     *
     * @param lockKey       unique key for the lock
     * @param lockValue     owner token (UUID) for safe atomic release
     * @param expireSeconds lock time-to-live in seconds
     * @return true if the lock was successfully acquired, false otherwise
     */
    boolean acquireLock(String lockKey, String lockValue, long expireSeconds);

    /**
     * Safely releases the lock only if the caller still owns it.
     *
     * @param lockKey   unique key for the lock
     * @param lockValue owner token expected to be present
     */
    void releaseLock(String lockKey, String lockValue);
}
