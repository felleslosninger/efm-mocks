package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final IncomingMessageRepository incomingMessageRepository;
    private final OutgoingMessageRepository outgoingMessageRepository;

    @GetMapping("/api/messages")
    public Collection<DashboardInfo> getMesssages() {
        log.info("GET /api/messages");
        return incomingMessageRepository.findAll()
                .stream()
                .map(IncomingMessage::getDashboardInfo)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/messages/log")
    public List<DashboardInfo> getMesssageLog() {
        log.info("GET /api/messages/log");
        return outgoingMessageRepository.findAll()
                .stream()
                .map(OutgoingMessage::getDashboardInfo)
                .collect(Collectors.toList());

    }

    @DeleteMapping("/api/messages")
    public void deleteMesssages() {
        log.info("DELETE /api/messages");
        incomingMessageRepository.deleteAll();
    }

    @DeleteMapping("/api/messages/log")
    public void clearLog() {
        log.info("DELETE /api/messages/log");
        outgoingMessageRepository.deleteAll();
    }
}