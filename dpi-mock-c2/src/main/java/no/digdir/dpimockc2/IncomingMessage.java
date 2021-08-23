package no.digdir.dpimockc2;

import lombok.Data;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import no.digdir.dpi.client.domain.Message;

@Data
public class IncomingMessage {

    private PartnerIdentification partnerIdentification;
    private DashboardInfo dashboardInfo;
    private Message message;
}
