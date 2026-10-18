package tech.abhiram.loompay.service;

/**
 * Abstraction for distributed locking mechanisms.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>ISP (Interface Segregation Principle):</strong> Exposes a focused, client-centric contract
 *       containing only lock acquisition and safe ownership-validated release operations.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Decouples payment transaction workflows from
 *       concrete lock managers (e.g., Redis Lua, Zookeeper, Redlock).</li>
 *   <li><strong>OCP (Open/Closed Principle):</strong> Enables adding alternative distributed lock algorithms
 *       without touching checkout or order processing logic.</li>
 * </ul>
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
