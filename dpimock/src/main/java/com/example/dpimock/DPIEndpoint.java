package com.example.dpimock;

import model.Message;
import model.MessagesSingleton;

import no.difi.commons.sbdh.jaxb.*;
import no.difi.oxalis.api.model.Direction;
import org.oasis_open.docs.ebxml_bp.ebbp_signals_2.MessagePartNRInformation;
import org.oasis_open.docs.ebxml_bp.ebbp_signals_2.NonRepudiationInformation;
import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.*;
import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.MessageInfo;
import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.Error;
import org.oasis_open.docs.ebxml_msg.ebms.v3_0.ns.core._200704.Description;
import org.springframework.ws.context.MessageContext;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.springframework.ws.soap.saaj.SaajSoapMessage;
import org.springframework.ws.soap.server.endpoint.annotation.SoapAction;
import org.w3.xmldsig.ReferenceType;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import util.*;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.soap.*;
import no.difi.oxalis.api.timestamp.Timestamp;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.stream.Collectors;


@Endpoint
public class DPIEndpoint {

    private static final String NAMESPACE_URI = "http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader";

    public String soapMessageToString(SOAPMessage message)
    {
        String result = null;

        if (message != null)
        {
            ByteArrayOutputStream baos = null;
            try
            {
                baos = new ByteArrayOutputStream();
                message.writeTo(baos);
                result = baos.toString();
            }
            catch (Exception e)
            {
            }
            finally
            {
                if (baos != null)
                {
                    try
                    {
                        baos.close();
                    }
                    catch (IOException ioe)
                    {
                    }
                }
            }
        }
        return result;
    }

    @SuppressWarnings("Duplicates")
    @SoapAction(value="")
    public void receipt(MessageContext context) throws DatatypeConfigurationException, SOAPException {
        SaajSoapMessage message = (SaajSoapMessage) context.getRequest();

        SOAPMessage soapMessage = message.getSaajMessage();

        SOAPHeader soapHeader = null;
        try {
            soapHeader = getSoapHeader(soapMessage);
        } catch (OxalisAs4Exception e) {
            e.printStackTrace();
        }

        Timestamp ts = new Timestamp(new Date(), null);
        List<ReferenceType> referenceList = null;
        try {
            referenceList = SOAPHeaderParser.getReferenceListFromSignedInfo(soapHeader);
        } catch (OxalisAs4Exception e) {
            e.printStackTrace();
        } catch (SOAPException e) {
            e.printStackTrace();
        }

        DefaultMessageIdGenerator messageIdGenerator = new DefaultMessageIdGenerator("mock");
        String messageId = messageIdGenerator.generate();

        SOAPMessage response = null;
        try {
            response = createSOAPReceipt(ts, messageId, referenceList);
        } catch (OxalisAs4Exception e) {
            e.printStackTrace();
        }

        SaajSoapMessage webServiceMessage = (SaajSoapMessage)context.getResponse();

        webServiceMessage.setSaajMessage(response);

        System.out.println("\n\n\n\n");

        System.out.println(soapMessageToString(response));

        System.out.println("\n\n\n\n");

    }

    @SuppressWarnings("Duplicates")
    private SOAPMessage createSOAPReceipt(Timestamp ts,
                                          String refToMessageId,
                                          List<ReferenceType> referenceList) throws OxalisAs4Exception, DatatypeConfigurationException, SOAPException {
        SignalMessage signalMessage;
        SOAPHeaderElement messagingHeader;
        SOAPMessage message;
        try {

            MessageFactory messageFactory = MessageFactory.newInstance(SOAPConstants.SOAP_1_2_PROTOCOL);
            message = messageFactory.createMessage();

            SOAPHeader soapHeader = message.getSOAPHeader();

            messagingHeader = soapHeader.addHeaderElement(Constants.MESSAGING_QNAME);
            messagingHeader.setMustUnderstand(true);

        } catch (SOAPException e) {
            throw new OxalisAs4Exception("Could not create SOAP message", e);
        }

        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(ts.getDate());

        XMLGregorianCalendar xmlGc;
        try {
            xmlGc = DatatypeFactory.newInstance().newXMLGregorianCalendar(gc);
        } catch (DatatypeConfigurationException e) {
            throw new OxalisAs4Exception("Could not parse timestamp", e);
        }

        // Generate Message-Id
        DefaultMessageIdGenerator messageIdGenerator = new DefaultMessageIdGenerator("mock");
        String messageId = messageIdGenerator.generate();

        if (!MessageIdUtil.verify(messageId))
            throw new OxalisAs4Exception(
                    "Invalid Message-ID '" + messageId + "' generated.");

        MessageInfo messageInfo = MessageInfo.builder()
                .withTimestamp(xmlGc)
                .withMessageId(messageId)
                .withRefToMessageId(refToMessageId)
                .build();

        List<MessagePartNRInformation> mpList = referenceList.stream()
                .map(r -> MessagePartNRInformation.builder()
                        .withReference(r).build())
                .collect(Collectors.toList());

        NonRepudiationInformation nri = NonRepudiationInformation.builder()
                .addMessagePartNRInformation(mpList)
                .build();


        if (MessagesSingleton.getInstance().messages.size() > 0) {
           // MessagesSingleton.getInstance().messages.remove(0);
            MessagesSingleton messages = MessagesSingleton.getInstance();
            StandardBusinessDocumentHeader header = new StandardBusinessDocumentHeader();
            header.setHeaderVersion("1.0");

            // Set sender:
            List<Partner> partners = header.getSender();
            Partner partner = new Partner();
            PartnerIdentification partnerIdentification =  new PartnerIdentification();
            partnerIdentification.setValue(messages.messages.get(0).getSenderOrgNum());
            partnerIdentification.setAuthority("urn:oasis:names:tc:ebcore:partyid-type:iso6523:9908");
            partner.setIdentifier(partnerIdentification);

            partners.add(partner);

            // Set receiver:
            List<Partner> receivers = header.getReceiver();
            Partner receiverPartner = new Partner();
            PartnerIdentification receiverPartnerIdentification = new PartnerIdentification();
            receiverPartnerIdentification.setValue(messages.messages.get(0).getReceiverOrgNum());
            receiverPartnerIdentification.setAuthority("urn:oasis:names:tc:ebcore:partyid-type:iso6523:9908");
            receiverPartner.setIdentifier(receiverPartnerIdentification);
            receivers.add(receiverPartner);

            // Set document identification

            DocumentIdentification documentIdentification = new DocumentIdentification();

            documentIdentification.setStandard("urn:no:difi:sdp:1.0");
            documentIdentification.setTypeVersion("1.0");
            documentIdentification.setInstanceIdentifier(messages.messages.get(0).getConversationId());
            documentIdentification.setType("kvittering");
            documentIdentification.setCreationDateAndTime(toXMLGregorianCalendar(OffsetDateTime.now()));

            header.setDocumentIdentification(documentIdentification);

            // Set business scope
            BusinessScope businessScope = new BusinessScope();
            List<Scope> scopes = businessScope.getScope();
            Scope scope = new Scope();
            scope.setType("ConversationId");
            scope.setInstanceIdentifier(messages.messages.get(0).getMessageId());
            scope.setIdentifier("urn:no:difi:sdp:1.0");
            scopes.add(scope);

            header.setBusinessScope(businessScope);

            StandardBusinessDocument sbd = new StandardBusinessDocument();
            sbd.setStandardBusinessDocumentHeader(header);

            SOAPBody soapBody = message.getSOAPBody();
//            SOAPBodyElement sbdBodyElement = soapBody.addBodyElement(Constants.SBD_QNAME);

            JAXBElement<StandardBusinessDocument> sbdJAXBElement = new JAXBElement<>(Constants.SBD_QNAME,
                    (Class<StandardBusinessDocument>) sbd.getClass(), sbd);

            PartyId fromPartyId = PartyId.builder().withType("urn:oasis:names:tc:ebcore:partyid-type:iso6523:9908").withValue(messages.messages.get(0).getReceiverOrgNum()).build();

            PartyId toPartyId = PartyId.builder().withType("urn:oasis:names:tc:ebcore:partyid-type:iso6523:9908").withValue(messages.messages.get(0).getReceiverOrgNum()).build();

            CollaborationInfo collaborationInfo = CollaborationInfo.builder()
                    .withAgreementRef(AgreementRef.builder().withValue("http://begrep.difi.no/SikkerDigitalPost/1.0/transportlag/Meldingsutveksling/FormidleDigitalPostForsendelse").build())
                    .withService(Service.builder().withValue("SDP").build())
                    .withAction("KvitteringsForespoersel")
                    .withConversationId(messages.messages.get(0).getMessageId())
                    .build();

            UserMessage userMessage = UserMessage.builder()
                    .withMessageInfo(messageInfo)
                    .withPartyInfo(PartyInfo.builder()
                            .withFrom(From.builder()
                                    .withPartyId(fromPartyId)
                                    .withRole("urn:sdp:meldingsformidler")
                                    .build())
                            .withTo(To.builder()
                                    .withPartyId(toPartyId)
                                    .withRole("urn:sdp:avsender")
                                    .build())
                            .build())
                    .withCollaborationInfo(collaborationInfo)
                    .withPayloadInfo(PayloadInfo.builder().withPartInfo(PartInfo.builder().build()).build())
                    .build();
            userMessage.setMpc("urn:normal:no.difi.move.integrasjonspunkt-dev");

            JAXBElement<UserMessage> userMessageJAXBElement;

            userMessageJAXBElement = new JAXBElement<>(Constants.USER_MESSAGE_QNAME,
                    (Class<UserMessage>) userMessage.getClass(), userMessage);

            try {
                Marshaller marshaller = Marshalling.getInstance().getJaxbContext().createMarshaller();
                marshaller.marshal(sbdJAXBElement, soapBody);
                marshaller.marshal(userMessageJAXBElement, messagingHeader);
            } catch (JAXBException e) {
                throw new OxalisAs4Exception("Could not marshal signal message to header", e);
            }


        } else {
            Error error = Error.builder()
                    .withCategory("Communication")
                    .withErrorCode("EBMS:0006")
                    .withOrigin("ebMS")
                    .withRefToMessageInError(refToMessageId)
                    .withSeverity("warning")
                    .withShortDescription("EmptyMessagePartitionChannel")
                    .withDescription(Description.builder()
                            .withLang("en")
                            .withValue("There is no message available for pulling from this MPC at this moment.").build())
                    .build();

            signalMessage = SignalMessage.builder()
                    .withMessageInfo(messageInfo)
                    .withError(error)
                    //.withReceipt(Receipt.builder().withAny(nri).build())
                    .build();

            JAXBElement<SignalMessage> signalMessageJAXBElement;
            signalMessageJAXBElement = new JAXBElement<>(Constants.SIGNAL_MESSAGE_QNAME,
                    (Class<SignalMessage>) signalMessage.getClass(), signalMessage);

            try {
                Marshaller marshaller = Marshalling.getInstance().getJaxbContext().createMarshaller();
                marshaller.marshal(signalMessageJAXBElement, messagingHeader);
            } catch (JAXBException e) {
                throw new OxalisAs4Exception("Could not marshal signal message to header", e);
            }
        }
        return message;
    }

    private XMLGregorianCalendar toXMLGregorianCalendar(OffsetDateTime in) {
        return in != null ? toXMLGregorianCalendar(in.toZonedDateTime()) : null;
    }

    private XMLGregorianCalendar toXMLGregorianCalendar(ZonedDateTime in) {
        return in != null ? toXMLGregorianCalendar(GregorianCalendar.from(in)) : null;
    }

    private XMLGregorianCalendar toXMLGregorianCalendar(GregorianCalendar gcal) {
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(gcal);
        } catch (DatatypeConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "StandardBusinessDocument")
    @ResponsePayload
    public void dpi(@RequestPayload StandardBusinessDocument sbd, MessageContext context) throws OxalisAs4Exception, SOAPException {

        SaajSoapMessage message = (SaajSoapMessage) context.getRequest();

        SOAPMessage soapMessage = message.getSaajMessage();

        SOAPHeader soapHeader = getSoapHeader(soapMessage);

        UserMessage userMessage = SOAPHeaderParser.getUserMessage(soapHeader);

        As4EnvelopeHeader envelopeHeader = parseAs4EnvelopeHeader(userMessage);

        saveIncomingMessage(envelopeHeader);

        Timestamp ts = getTimestamp(soapMessage);

        List<ReferenceType> referenceList = SOAPHeaderParser.getReferenceListFromSignedInfo(soapHeader);

        SOAPMessage response = createSOAPResponse(ts, envelopeHeader.getMessageId(), referenceList);

        SaajSoapMessage webServiceMessage = (SaajSoapMessage)context.getResponse();

        webServiceMessage.setSaajMessage(response);
    }

    private Timestamp getTimestamp(SOAPMessage header) throws OxalisAs4Exception, SOAPException {
        Timestamp ts;
        byte[] signature = SOAPHeaderParser.getSignature(header);

        try {
            SystemTimestampProvider systemTimestampProvider = new SystemTimestampProvider();

            ts = systemTimestampProvider.generate(signature, Direction.IN);

        } catch (Exception e) {
            throw new OxalisAs4Exception("Error generating timestamp", e);
        }
        return ts;
    }

    /**
     * Create a message in memory that we expose in the incoming messages API.
     * **/
    private void saveIncomingMessage(As4EnvelopeHeader header){
        Message dbMessage = new Message();
        dbMessage.setConversationId(header.getConversationId());
        dbMessage.setSenderOrgNum(header.getFromPartyId().get(0));
        dbMessage.setReceiverOrgNum(header.getToPartyId().get(0));
        dbMessage.setMessageId(header.getMessageId());
        MessagesSingleton.getInstance().addMessage(dbMessage);

    }

    private As4EnvelopeHeader parseAs4EnvelopeHeader(UserMessage userMessage) {
        As4EnvelopeHeader as4EnvelopeHeader = new As4EnvelopeHeader();

        as4EnvelopeHeader.setMessageId(userMessage.getMessageInfo().getMessageId());
        as4EnvelopeHeader.setConversationId(userMessage.getCollaborationInfo().getConversationId());

        as4EnvelopeHeader.setFromPartyId(userMessage.getPartyInfo().getFrom().getPartyId().stream().map(PartyId::getValue).collect(Collectors.toList()));
        as4EnvelopeHeader.setFromPartyRole(userMessage.getPartyInfo().getFrom().getRole());

        as4EnvelopeHeader.setToPartyId(userMessage.getPartyInfo().getTo().getPartyId().stream().map(PartyId::getValue).collect(Collectors.toList()));
        as4EnvelopeHeader.setToPartyRole(userMessage.getPartyInfo().getTo().getRole());

        as4EnvelopeHeader.setAction(userMessage.getCollaborationInfo().getAction());
        as4EnvelopeHeader.setService(userMessage.getCollaborationInfo().getService().getValue());

        as4EnvelopeHeader.setPayloadCIDs(userMessage.getPayloadInfo().getPartInfo().stream().map(PartInfo::getHref).collect(Collectors.toList()));

        return as4EnvelopeHeader;
    }

    private SOAPHeader getSoapHeader(SOAPMessage request) throws OxalisAs4Exception {
        SOAPHeader header;
        try {
            header = request.getSOAPHeader();
        } catch (SOAPException e) {
            throw new OxalisAs4Exception("Could not get SOAP header", e);
        }
        return header;
    }

    @SuppressWarnings("Duplicates")
    private SOAPMessage createSOAPResponse(Timestamp ts,
                                           String refToMessageId,
                                           List<ReferenceType> referenceList) throws OxalisAs4Exception {
        SignalMessage signalMessage;
        SOAPHeaderElement messagingHeader;
        SOAPMessage message;
        try {

            MessageFactory messageFactory = MessageFactory.newInstance(SOAPConstants.SOAP_1_2_PROTOCOL);
            message = messageFactory.createMessage();

            SOAPHeader soapHeader = message.getSOAPHeader();

            messagingHeader = soapHeader.addHeaderElement(Constants.MESSAGING_QNAME);
            messagingHeader.setMustUnderstand(true);

        } catch (SOAPException e) {
            throw new OxalisAs4Exception("Could not create SOAP message", e);
        }

        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(ts.getDate());

        XMLGregorianCalendar xmlGc;
        try {
            xmlGc = DatatypeFactory.newInstance().newXMLGregorianCalendar(gc);
        } catch (DatatypeConfigurationException e) {
            throw new OxalisAs4Exception("Could not parse timestamp", e);
        }

        // Generate Message-Id
        DefaultMessageIdGenerator messageIdGenerator = new DefaultMessageIdGenerator("mock");
        String messageId = messageIdGenerator.generate();

        if (!MessageIdUtil.verify(messageId))
            throw new OxalisAs4Exception(
                    "Invalid Message-ID '" + messageId + "' generated.");

        MessageInfo messageInfo = MessageInfo.builder()
                .withTimestamp(xmlGc)
                .withMessageId(messageId)
                .withRefToMessageId(refToMessageId)
                .build();

        List<MessagePartNRInformation> mpList = referenceList.stream()
                .map(r -> MessagePartNRInformation.builder()
                        .withReference(r).build())
                .collect(Collectors.toList());

        NonRepudiationInformation nri = NonRepudiationInformation.builder()
                .addMessagePartNRInformation(mpList)
                .build();

        signalMessage = SignalMessage.builder()
                .withMessageInfo(messageInfo)
                .withReceipt(Receipt.builder().withAny(nri).build())
                .build();

        JAXBElement<SignalMessage> userMessageJAXBElement = new JAXBElement<>(Constants.SIGNAL_MESSAGE_QNAME,
                (Class<SignalMessage>) signalMessage.getClass(), signalMessage);

        try {
            Marshaller marshaller = Marshalling.getInstance().getJaxbContext().createMarshaller();
            marshaller.marshal(userMessageJAXBElement, messagingHeader);
        } catch (JAXBException e) {
            throw new OxalisAs4Exception("Could not marshal signal message to header", e);
        }

        return message;
    }



}

