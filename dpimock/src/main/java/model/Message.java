package model;


import lombok.Data;

@Data
public class Message {

    private String messageId;
    private String receiverOrgNum;
    private String senderOrgNum;
    private String conversationId;
}
