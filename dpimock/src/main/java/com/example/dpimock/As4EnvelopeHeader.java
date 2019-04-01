package com.example.dpimock;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class As4EnvelopeHeader{

    private String messageId;
    private String conversationId;

    private List<String> fromPartyId;
    private String fromPartyRole;

    private List<String> toPartyId;
    private String toPartyRole;

    private String service;
    private String action;

    private Map<String, String> messageProperties = new HashMap<>();

    private List<String> payloadCIDs = new ArrayList<>();

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public List<String> getFromPartyId() {
        return fromPartyId;
    }

    public void setFromPartyId(List<String> fromPartyId) {
        this.fromPartyId = fromPartyId;
    }

    public String getFromPartyRole() {
        return fromPartyRole;
    }

    public void setFromPartyRole(String fromPartyRole) {
        this.fromPartyRole = fromPartyRole;
    }

    public List<String> getToPartyId() {
        return toPartyId;
    }

    public void setToPartyId(List<String> toPartyId) {
        this.toPartyId = toPartyId;
    }

    public String getToPartyRole() {
        return toPartyRole;
    }

    public void setToPartyRole(String toPartyRole) {
        this.toPartyRole = toPartyRole;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Map<String, String> getMessageProperties() {
        return messageProperties;
    }

    public void setMessageProperties(Map<String, String> messageProperties) {
        this.messageProperties = messageProperties;
    }

    public List<String> getPayloadCIDs() {
        return payloadCIDs;
    }

    public void setPayloadCIDs(List<String> payloadCIDs) {
        this.payloadCIDs = payloadCIDs;
    }

    @Override
    public String toString() {
        return "As4EnvelopeHeader{" +
                "messageId='" + messageId + '\'' +
                ", conversationId='" + conversationId + '\'' +
                ", fromPartyId=" + fromPartyId +
                ", fromPartyRole='" + fromPartyRole + '\'' +
                ", toPartyId=" + toPartyId +
                ", toPartyRole='" + toPartyRole + '\'' +
                ", service='" + service + '\'' +
                ", action='" + action + '\'' +
                ", messageProperties=" + messageProperties +
                ", payloadCIDs=" + payloadCIDs +
                '}';
    }
}
