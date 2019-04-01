package util;
import javax.xml.datatype.XMLGregorianCalendar;

public class MessageInfo {

    private XMLGregorianCalendar timestamp;
    private String messageId;
    private String refToMessageId;

    public MessageInfo(XMLGregorianCalendar timestamp, String messageId, String refToMessageId) {
        this.timestamp = timestamp;
        this.messageId = messageId;
        this.refToMessageId = refToMessageId;
    }

    public XMLGregorianCalendar getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(XMLGregorianCalendar timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getRefToMessageId() {
        return refToMessageId;
    }

    public void setRefToMessageId(String refToMessageId) {
        this.refToMessageId = refToMessageId;
    }
}
