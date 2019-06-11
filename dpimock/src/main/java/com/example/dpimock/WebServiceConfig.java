package com.example.dpimock;

import org.apache.wss4j.common.crypto.Crypto;
import org.apache.wss4j.common.crypto.Merlin;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.server.EndpointInterceptor;
import org.springframework.ws.soap.SoapVersion;
import org.springframework.ws.soap.saaj.SaajSoapMessageFactory;
import org.springframework.ws.soap.security.wss4j2.Wss4jSecurityInterceptor;
import org.springframework.ws.soap.security.wss4j2.support.CryptoFactoryBean;
import org.springframework.ws.soap.security.xwss.callback.KeyStoreCallbackHandler;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

import javax.xml.crypto.dsig.DigestMethod;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.List;

import static util.Constants.RSA_SHA256;

@EnableWs
@Configuration
public class WebServiceConfig extends WsConfigurerAdapter {

    @Value("${keystore.name}")
    private String keystoreName;

    @Value("${truststore.name}")
    private String truststoreName;

    @Bean
    public SaajSoapMessageFactory messageFactory() {
        SaajSoapMessageFactory messageFactory = new SaajSoapMessageFactory();
        messageFactory.setSoapVersion(SoapVersion.SOAP_12);
        return messageFactory;
    }

    @Bean
    public KeyStoreCallbackHandler securityCallbackHandler() {
        KeyStoreCallbackHandler callbackHandler = new KeyStoreCallbackHandler();
        callbackHandler.setPrivateKeyPassword("changeit");
        callbackHandler.setTrustStore(getKeyStore("mock-truststore.jks"));

        return callbackHandler;
    }

    @Bean
    public Wss4jSecurityInterceptor securityInterceptor() {
        Wss4jSecurityInterceptor securityInterceptor = new As4SecurityInterceptor();

        // validate incoming request
        securityInterceptor.setSecurementActions("Timestamp Signature");
        securityInterceptor.setValidationActions("Timestamp Signature");

        securityInterceptor.setValidationSignatureCrypto(getCrypto());
        securityInterceptor.setValidationDecryptionCrypto(getCrypto());
        securityInterceptor.setValidationCallbackHandler(securityCallbackHandler());

        // encrypt the response
        securityInterceptor.setSecurementSignatureParts("{}{}Body; {}{http://docs.oasis-open.org/ebxml-msg/ebms/v3.0/ns/core/200704/} Messaging; {}{http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd}Timestamp");
        securityInterceptor.setSecurementSignatureKeyIdentifier("DirectReference");
        securityInterceptor.setSecurementEncryptionCrypto(getCrypto());

        securityInterceptor.setValidateResponse(true);
        securityInterceptor.setRemoveSecurityHeader(false);
        securityInterceptor.setEnableSignatureConfirmation(true);
        securityInterceptor.setSecurementSignatureAlgorithm(RSA_SHA256);
        securityInterceptor.setSecurementSignatureDigestAlgorithm(DigestMethod.SHA256);

        // sign the response
        securityInterceptor.setSecurementUsername("984661185");
        securityInterceptor.setSecurementPassword("changeit");
        securityInterceptor.setSecurementSignatureCrypto(getCrypto());

        return securityInterceptor;
    }

    private Crypto getCrypto(){
        Merlin merlin = new Merlin();
        merlin.setKeyStore(getKeyStore(keystoreName));
        merlin.setTrustStore(getKeyStore(truststoreName));
        return merlin;
    }

    private KeyStore getKeyStore(String keyStoreName) {
        try {
            KeyStore key_store;
            key_store = KeyStore.getInstance("jks");
            try (InputStream is = new ClassPathResource(keyStoreName).getInputStream()) {
                key_store.load(is, "changeit".toCharArray());
            }
            return key_store;
        } catch (Exception e) {
            throw new RuntimeException("Unable to load keystore");
        }
    }

    @Override
    public void addInterceptors(List<EndpointInterceptor> interceptors) {
        try {
            interceptors.add(securityInterceptor());
        } catch (Exception e) {
            throw new RuntimeException("could not initialize security interceptor", e);
        }
    }

    @Bean
    public ServletRegistrationBean messageDispatcherServlet(ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean(servlet, "/as4/*");
    }

    @Bean(name = "StandardBusinessDocument")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema sbdSchema) {
        DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
        wsdl11Definition.setPortTypeName("sbdPort");
        wsdl11Definition.setLocationUri("/as4");
        wsdl11Definition.setTargetNamespace("http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader");
        wsdl11Definition.setSchema(sbdSchema);
        return wsdl11Definition;
    }

    @Bean
    public XsdSchema standardBusinessDocumentSchema() {
        return new SimpleXsdSchema(new ClassPathResource("xsd/sbd/StandardBusinessDocumentHeader.xsd"));
    }
}