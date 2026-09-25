package tech.abhiram.loompay.router;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.SortedMap;
import java.util.TreeMap;

import static java.util.Objects.hash;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConsistentHashRouter {

    private final SortedMap<Integer, String> ring = new TreeMap<>();

    private final int numberOfReplicas;

    public ConsistentHashRouter() {
        this(3);
    }

    public synchronized void addNode(String serverName) {
        for (int i = 0; i < numberOfReplicas; i++) {
            int hashPosition = hash(serverName + "#" + i);
            ring.put(hashPosition, serverName);
        }
        log.info("Added server: {} with {} virtual replicas", serverName, numberOfReplicas);
    }

    public synchronized void removeNode(String sevrerName) {
        for (int i = 0; i < numberOfReplicas; i++) {
            int hashPosition = hash(sevrerName + "#" + i);
            ring.remove(hashPosition);
        }
        log.info("Removed server: {}", sevrerName);
    }

    public String route(String key) {
        if (ring.isEmpty()) {
            throw new IllegalStateException("Consistent hash ring is empty! No servers available.");
        }

        int keyPosition = hash(key);

        SortedMap<Integer, String> tailMap = ring.tailMap(keyPosition);

        int targetPosition = !tailMap.isEmpty() ? tailMap.firstKey() : ring.firstKey();

        return ring.get(targetPosition);
    }

    public int getRingSize() {
        return ring.size();
    }

    private int hash(String key) {
        return (key.hashCode() & Integer.MAX_VALUE);
    }


}
