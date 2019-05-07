package model;

public class Message {


    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getReceiverOrgNum() {
        return receiverOrgNum;
    }

    public void setReceiverOrgNum(String receiverOrgNum) {
        this.receiverOrgNum = receiverOrgNum;
    }

    public String getSenderOrgNum() {
        return senderOrgNum;
    }

    public void setSenderOrgNum(String senderOrgNum) {
        this.senderOrgNum = senderOrgNum;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    private String messageId;

    private String receiverOrgNum;

    private String senderOrgNum;

    private String conversationId;


}
