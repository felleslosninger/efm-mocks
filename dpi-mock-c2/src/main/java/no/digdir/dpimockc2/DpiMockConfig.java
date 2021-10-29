package no.digdir.dpimockc2;

import no.difi.meldingsutveksling.dpi.client.DpiClientConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.time.Clock;

@Configuration
@Import(
        DpiClientConfig.class
)
public class DpiMockConfig {

    @Bean
    public Clock systemCLock() {
        return Clock.systemDefaultZone();
    }
}
