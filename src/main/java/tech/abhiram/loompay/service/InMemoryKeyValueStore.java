package tech.abhiram.loompay.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Single-process fallback for local development when Redis is unavailable.
 * <p>
 * <strong>Not</strong> a distributed store: it provides no cross-node
 * coordination. Bind only to the {@code local} Spring profile.
 */
@Component
@Profile("local")
@Slf4j
public class InMemoryKeyValueStore implements KeyValueStore {

    private record Entry(String value, Instant expiresAt) {
        boolean isExpired() {
            return expiresAt != null && Instant.now().isAfter(expiresAt);
        }
    }

    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> counters = new ConcurrentHashMap<>();

    public InMemoryKeyValueStore() {
        log.warn("Using InMemoryKeyValueStore (local profile). Locks and rate limits are "
                + "process-local and not shared across instances. Do not use in production.");
    }

    private Entry live(String key) {
        Entry entry = store.get(key);
        if (entry != null && entry.isExpired()) {
            store.remove(key);
            return null;
        }
        return entry;
    }

    @Override
    public boolean setIfAbsent(String key, String value, Duration ttl) {
        Entry fresh = new Entry(value, ttl == null ? null : Instant.now().plus(ttl));
        Entry existing = live(key);
        if (existing != null) {
            return false;
        }
        Entry previous = store.putIfAbsent(key, fresh);
        return previous == null;
    }

    @Override
    public long increment(String key) {
        return counters.merge(key, 1L, Long::sum);
    }

    @Override
    public void expire(String key, Duration ttl) {
        Entry entry = live(key);
        if (entry != null) {
            store.put(key, new Entry(entry.value(), Instant.now().plus(ttl)));
        }
        Long value = counters.get(key);
        if (value != null) {
            scheduleCounterReset(key, ttl);
        }
    }

    private void scheduleCounterReset(String key, Duration ttl) {
        Thread.ofVirtual().start(() -> {
            try {
                Thread.sleep(ttl.toMillis());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
            counters.remove(key);
        });
    }

    @Override
    public String get(String key) {
        Entry entry = live(key);
        return entry == null ? null : entry.value();
    }

    @Override
    public void delete(String key) {
        store.remove(key);
    }

    @Override
    public boolean compareAndDelete(String key, String expectedValue) {
        Entry entry = live(key);
        if (entry != null && entry.value().equals(expectedValue)) {
            store.remove(key);
            return true;
        }
        return false;
    }
}
