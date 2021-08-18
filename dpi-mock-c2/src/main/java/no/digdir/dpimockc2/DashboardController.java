package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final IncomingMessageRepository incomingMessageRepository;
    private final OutgoingMessageRepository outgoingMessageRepository;

    @GetMapping("/api/messages")
    public Collection<DashboardInfo> getMesssages() {
        return incomingMessageRepository.findAll()
                .stream()
                .map(IncomingMessage::getDashboardInfo)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/messages/log")
    public List<DashboardInfo> getMesssageLog() {
        return outgoingMessageRepository.findAll()
                .stream()
                .map(OutgoingMessage::getDashboardInfo)
                .collect(Collectors.toList());

    }

    @DeleteMapping("/api/messages")
    public void deleteMesssages() {
        incomingMessageRepository.deleteAll();
    }

    @DeleteMapping("/api/messages/log")
    public void clearLog() {
        outgoingMessageRepository.deleteAll();
    }
}