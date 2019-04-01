package com.example.dpimock;

import org.apache.wss4j.dom.WSConstants;
import org.apache.wss4j.dom.handler.RequestData;
import org.apache.wss4j.dom.handler.WSHandlerConstants;
import org.springframework.ws.context.MessageContext;
import org.springframework.ws.soap.SoapHeaderElement;
import org.springframework.ws.soap.SoapMessage;
import org.springframework.ws.soap.security.wss4j2.Wss4jSecurityInterceptor;

public class As4SecurityInterceptor extends Wss4jSecurityInterceptor {

    @Override
    protected RequestData initializeRequestData(MessageContext messageContext) {

        messageContext.setProperty(WSHandlerConstants.ENC_MGF_ALGO, WSConstants.MGF_SHA256);
        messageContext.setProperty(WSHandlerConstants.ENC_DIGEST_ALGO, WSConstants.SHA256);


        RequestData requestData = super.initializeRequestData(messageContext);
        AttachmentCallbackHandler attachmentCallbackHandler = new AttachmentCallbackHandler((SoapMessage) messageContext.getRequest());
        requestData.setAttachmentCallbackHandler(attachmentCallbackHandler);
        requestData.setAddInclusivePrefixes(true);

        return requestData;
    }

    @Override
    protected RequestData initializeValidationRequestData(MessageContext messageContext) {
        messageContext.setProperty(WSHandlerConstants.ENC_MGF_ALGO, WSConstants.MGF_SHA256);
        messageContext.setProperty(WSHandlerConstants.ENC_DIGEST_ALGO, WSConstants.SHA256);

        RequestData requestData = super.initializeValidationRequestData(messageContext);
        AttachmentCallbackHandler attachmentCallbackHandler = new AttachmentCallbackHandler((SoapMessage) messageContext.getRequest());
        requestData.setAttachmentCallbackHandler(attachmentCallbackHandler);
        requestData.setAddInclusivePrefixes(true);
        return requestData;
    }

    @Override
    public boolean understands(SoapHeaderElement headerElement) {
        return true;
    }
}