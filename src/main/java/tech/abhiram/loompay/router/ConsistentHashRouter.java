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


}
