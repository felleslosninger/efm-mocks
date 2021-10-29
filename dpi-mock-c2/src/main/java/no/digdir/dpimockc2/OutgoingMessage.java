package no.digdir.dpimockc2;

import lombok.Data;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import no.difi.meldingsutveksling.dpi.client.domain.MessageStatus;

import java.util.ArrayList;
import java.util.List;

@Data
public class OutgoingMessage {

    private PartnerIdentification partnerIdentification;
    private DashboardInfo dashboardInfo;
    private List<MessageStatus> statusList = new ArrayList<>();

    public OutgoingMessage addStatus(MessageStatus messageStatus) {
        statusList.add(messageStatus);
        return this;
    }
}
