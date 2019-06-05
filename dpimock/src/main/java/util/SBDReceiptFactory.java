package util;

import no.difi.begrep.sdp.schema_v10.Kvittering;
import no.difi.begrep.sdp.schema_v10.ObjectFactory;
import no.difi.commons.sbdh.jaxb.StandardBusinessDocument;
import org.springframework.stereotype.Component;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;

import static util.DocumentToDocumentConverter.toDomainDocument;


/**
 * Factory class for creating Kvittering documents. This class is the only one visible from outside and uses
 * the other package local classes to perform its tasks.
 *
 * @author Glenn bech
 */
@Component
public class SBDReceiptFactory {
    public static StandardBusinessDocument signAndWrapDocument(StandardBusinessDocument unsignedReceipt, Kvittering kvittering) throws UnrecoverableKeyException, NoSuchAlgorithmException, KeyStoreException {
        unsignedReceipt.setAny(new ObjectFactory().createKvittering(kvittering));

        org.w3c.dom.Document xmlDoc = DocumentToDocumentConverter.toXMLDocument(unsignedReceipt);
        org.w3c.dom.Document signedXmlDoc = DocumentSigner.sign(xmlDoc);

        return toDomainDocument(signedXmlDoc);
    }
}
