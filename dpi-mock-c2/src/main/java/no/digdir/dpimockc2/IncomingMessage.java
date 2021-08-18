package no.digdir.dpimockc2;

import lombok.Data;
import no.digdir.dpi.client.domain.Message;

@Data
public class IncomingMessage {

    private DashboardInfo dashboardInfo;
    private Message message;
}
