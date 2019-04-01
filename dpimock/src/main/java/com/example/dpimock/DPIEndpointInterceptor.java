//package com.example.dpimock;
//
//import no.difi.oxalis.api.model.Direction;
//import no.difi.oxalis.api.timestamp.Timestamp;
//import org.oasis_open.docs.ebxml_bp.ebbp_signals_2.MessagePartNRInformation;
//import org.oasis_open.docs.ebxml_bp.ebbp_signals_2.NonRepudiationInformation;
//import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.*;
//import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.MessageInfo;
//import org.springframework.ws.WebServiceMessage;
//import org.springframework.ws.context.MessageContext;
//import org.springframework.ws.server.EndpointInterceptor;
//import org.springframework.ws.soap.saaj.SaajSoapMessage;
//import org.w3.xmldsig.ReferenceType;
//import util.*;
//
//import javax.xml.bind.JAXBElement;
//import javax.xml.bind.JAXBException;
//import javax.xml.bind.Marshaller;
//import javax.xml.datatype.DatatypeConfigurationException;
//import javax.xml.datatype.DatatypeFactory;
//import javax.xml.datatype.XMLGregorianCalendar;
//import javax.xml.soap.*;
//import java.util.GregorianCalendar;
//import java.util.List;
//import java.util.stream.Collectors;
//
//public class DPIEndpointInterceptor implements EndpointInterceptor {
//    @Override
//    public boolean handleRequest(MessageContext messageContext, Object endpoint) throws Exception {
//        return true;
//    }
//
//    @Override
//    public boolean handleResponse(MessageContext context, Object endpoint) throws Exception {
//
//
//
//        return true;
//    }
//
//    @Override
//    public boolean handleFault(MessageContext messageContext, Object endpoint) throws Exception {
//        return true;
//    }
//
//    @Override
//    public void afterCompletion(MessageContext context, Object endpoint, Exception ex) throws Exception {
//
//        SaajSoapMessage message = (SaajSoapMessage) context.getRequest();
//
//
//        SOAPMessage soapMessage = message.getSaajMessage();
//
//        SOAPHeader soapHeader = getSoapHeader(soapMessage);
//
//        UserMessage userMessage = SOAPHeaderParser.getUserMessage(soapHeader);
//
//        As4EnvelopeHeader envelopeHeader = parseAs4EnvelopeHeader(userMessage);
//
//        Timestamp ts = getTimestamp(soapMessage);
//
//        List<ReferenceType> referenceList = SOAPHeaderParser.getReferenceListFromSignedInfo(soapMessage);
//
//        SOAPMessage response = createSOAPResponse(ts, envelopeHeader.getMessageId(), referenceList);
//
//        SaajSoapMessage webServiceMessage = (SaajSoapMessage)context.getResponse();
//
//        webServiceMessage.setSaajMessage(response);
//
//    }
//
//    private Timestamp getTimestamp(SOAPMessage header) throws OxalisAs4Exception, SOAPException {
//        Timestamp ts;
//        byte[] signature = SOAPHeaderParser.getSignature(header);
//
//        try {
//            SystemTimestampProvider systemTimestampProvider = new SystemTimestampProvider();
//
//            ts = systemTimestampProvider.generate(signature, Direction.IN);
//
//        } catch (Exception e) {
//
//            throw new OxalisAs4Exception("Error generating timestamp", e);
//        }
//        return ts;
//    }
//
//    public void validateMessageId(String messageId) throws OxalisAs4Exception {
//
//        if (!MessageIdUtil.verify(messageId))
//            throw new OxalisAs4Exception(
//                    "Invalid Message-ID '" + messageId + "' in inbound message.");
//    }
//
//    private As4EnvelopeHeader parseAs4EnvelopeHeader(UserMessage userMessage) {
//
//        As4EnvelopeHeader as4EnvelopeHeader = new As4EnvelopeHeader();
//
//        as4EnvelopeHeader.setMessageId(userMessage.getMessageInfo().getMessageId());
//        as4EnvelopeHeader.setConversationId(userMessage.getCollaborationInfo().getConversationId());
//
//        as4EnvelopeHeader.setFromPartyId(userMessage.getPartyInfo().getFrom().getPartyId().stream().map(PartyId::getValue).collect(Collectors.toList()));
//        as4EnvelopeHeader.setFromPartyRole(userMessage.getPartyInfo().getFrom().getRole());
//
//        as4EnvelopeHeader.setToPartyId(userMessage.getPartyInfo().getTo().getPartyId().stream().map(PartyId::getValue).collect(Collectors.toList()));
//        as4EnvelopeHeader.setToPartyRole(userMessage.getPartyInfo().getTo().getRole());
//
//        as4EnvelopeHeader.setAction(userMessage.getCollaborationInfo().getAction());
//        as4EnvelopeHeader.setService(userMessage.getCollaborationInfo().getService().getValue());
//
//        //as4EnvelopeHeader.setMessageProperties(userMessage.getMessageProperties().getProperty().stream().collect(Collectors.toMap(Property::getName, Property::getValue)));
//
//        as4EnvelopeHeader.setPayloadCIDs(userMessage.getPayloadInfo().getPartInfo().stream().map(PartInfo::getHref).collect(Collectors.toList()));
//
//        return as4EnvelopeHeader;
//    }
//
//    private SOAPHeader getSoapHeader(SOAPMessage request) throws OxalisAs4Exception {
//        SOAPHeader header;
//        try {
//            header = request.getSOAPHeader();
//        } catch (SOAPException e) {
//            throw new OxalisAs4Exception("Could not get SOAP header", e);
//        }
//        return header;
//    }
//
//    private SOAPMessage createSOAPResponse(Timestamp ts,
//                                    String refToMessageId,
//                                    List<ReferenceType> referenceList) throws OxalisAs4Exception {
//        SignalMessage signalMessage;
//        SOAPHeaderElement messagingHeader;
//        SOAPMessage message;
//        try {
//
//            MessageFactory messageFactory = MessageFactory.newInstance(SOAPConstants.SOAP_1_2_PROTOCOL);
//            message = messageFactory.createMessage();
//
//            SOAPHeader soapHeader = message.getSOAPHeader();
//
//            messagingHeader = soapHeader.addHeaderElement(Constants.MESSAGING_QNAME);
//            messagingHeader.setMustUnderstand(true);
//
//
//        } catch (SOAPException e) {
//            throw new OxalisAs4Exception("Could not create SOAP message", e);
//        }
//
//        GregorianCalendar gc = new GregorianCalendar();
//        gc.setTime(ts.getDate());
//
//        XMLGregorianCalendar xmlGc;
//        try {
//            xmlGc = DatatypeFactory.newInstance().newXMLGregorianCalendar(gc);
//        } catch (DatatypeConfigurationException e) {
//            throw new OxalisAs4Exception("Could not parse timestamp", e);
//        }
//
//        // Generate Message-Id
//
//        DefaultMessageIdGenerator messageIdGenerator = new DefaultMessageIdGenerator("mock");
//        String messageId = messageIdGenerator.generate();
//
//        if (!MessageIdUtil.verify(messageId))
//            throw new OxalisAs4Exception(
//                    "Invalid Message-ID '" + messageId + "' generated.");
//
//        org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.MessageInfo messageInfo = MessageInfo.builder()
//                .withTimestamp(xmlGc)
//                .withMessageId(messageId)
//                .withRefToMessageId(refToMessageId)
//                .build();
//
//        List<MessagePartNRInformation> mpList = referenceList.stream()
//                .map(r -> MessagePartNRInformation.builder().withReference(r).build())
//                .collect(Collectors.toList());
//
//        NonRepudiationInformation nri = NonRepudiationInformation.builder()
//                .addMessagePartNRInformation(mpList)
//                .build();
//
//        signalMessage = SignalMessage.builder()
//                .withMessageInfo(messageInfo)
//                .withReceipt(Receipt.builder().withAny(nri).build())
//                .build();
//
//        JAXBElement<SignalMessage> userMessageJAXBElement = new JAXBElement<>(Constants.SIGNAL_MESSAGE_QNAME,
//                (Class<SignalMessage>) signalMessage.getClass(), signalMessage);
//        try {
//            Marshaller marshaller = Marshalling.getInstance().getJaxbContext().createMarshaller();
//            marshaller.marshal(userMessageJAXBElement, messagingHeader);
//        } catch (JAXBException e) {
//            throw new OxalisAs4Exception("Could not marshal signal message to header", e);
//        }
//
//        return message;
//    }
//
//
//}
