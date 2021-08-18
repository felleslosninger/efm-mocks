package no.digdir.dpimockc2;


import lombok.Data;

@Data
public class DashboardInfo {

    private String messageId;
    private String receiverOrgNum;
    private String senderOrgNum;
    private String conversationId;
}
