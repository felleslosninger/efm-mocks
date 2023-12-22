package no.difi.meldingsutveksling.dpi.client;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import no.difi.meldingsutveksling.UUIDGenerator;
import no.difi.meldingsutveksling.config.DigitalPostInnbyggerConfig;
import no.difi.meldingsutveksling.config.IntegrasjonspunktProperties;
import no.difi.meldingsutveksling.dpi.client.internal.CreateJWT;
import no.difi.move.common.cert.KeystoreHelper;
import no.digdir.dpimockc2.CreateLeveringskvittering;
import no.digdir.dpimockc2.CreateReceiptJWT;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(IntegrasjonspunktProperties.class)
@Import({UUIDGenerator.class})
public class DpiClientTestConfig {

    @Bean
    public DigitalPostInnbyggerConfig digitalPostInnbyggerConfig(IntegrasjonspunktProperties properties) {
        return properties.getDpi();
    }

    @Bean
    @Primary
    public Clock fixedClock() {
        return Clock.fixed(Instant.parse("2021-05-21T11:19:57.12Z"), ZoneId.of("Europe/Oslo"));
    }

    @Bean
    public KeystoreHelper serverKeystoreHelper(DigitalPostInnbyggerConfig properties) {
        return new KeystoreHelper(properties.getServer().getKeystore());
    }

    @Bean
    public KeystoreHelper corner2keystoreHelper(DigitalPostInnbyggerConfig properties) {
        return new KeystoreHelper(properties.getServer().getKeystore());
    }

    @Bean
    @SneakyThrows
    public CreateJWT createJWTServer(KeystoreHelper corner2keystoreHelper) {
        return new CreateJWT(corner2keystoreHelper);
    }

    @Bean
    public CreateReceiptJWT createReceiptJWT(UUIDGenerator uuidGenerator, Clock clock) {
        return new CreateReceiptJWT(clock, uuidGenerator);
    }

    @Bean
    public CreateLeveringskvittering createLeveringskvittering(Clock clock) {
        return new CreateLeveringskvittering(clock);
    }

}
