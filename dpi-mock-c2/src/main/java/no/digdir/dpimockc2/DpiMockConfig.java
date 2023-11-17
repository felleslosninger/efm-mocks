package no.digdir.dpimockc2;

import no.difi.meldingsutveksling.UUIDGenerator;
import no.difi.meldingsutveksling.config.DigitalPostInnbyggerConfig;
import no.difi.meldingsutveksling.config.IntegrasjonspunktProperties;
import no.difi.meldingsutveksling.dokumentpakking.config.DokumentpakkingConfig;
import no.difi.meldingsutveksling.dpi.client.DpiClientConfig;
import no.difi.move.common.io.pipe.Plumber;
import no.difi.move.common.io.pipe.PromiseMaker;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.jta.JtaTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;

@Configuration
@Import(
        {DpiClientConfig.class, UUIDGenerator.class}
)
@EnableConfigurationProperties(IntegrasjonspunktProperties.class)
public class DpiMockConfig {

    @Bean
    public Clock systemCLock() {
        return Clock.systemDefaultZone();
    }

    @Bean
    public DigitalPostInnbyggerConfig digitalPostInnbyggerConfig(IntegrasjonspunktProperties properties) {
        return properties.getDpi();
    }

    @Bean
    public PlatformTransactionManager transactionManager(){
        return new JtaTransactionManager();
    }

    @Bean
    public TransactionTemplate transactionTemplate(PlatformTransactionManager transactionManager) {
        return new TransactionTemplate(transactionManager);
    }

}
