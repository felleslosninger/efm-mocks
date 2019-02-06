let envelope = (
    senderOrgNr,
    senderOrgName,
    senderEmail,
    senderRef,
    receiverOrgNr,
    receiverOrgName,
    receiverEmail,
    receiverRef,
    message,
    convId
    ) => {
    return `<s:Envelope encoding="utf-8" 
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <PutMessageRequest xmlns="http://www.arkivverket.no/Noark/Exchange/types">
            <envelope contentNamespace="http://www.arkivverket.no/Noark4-1-WS-WD/types" conversationId="${convId}" 
                xmlns="">
                <sender>
                    <orgnr>${senderOrgNr}</orgnr>
                    <name>${senderOrgName}</name>
                    <email>${senderEmail}</email>
                    <ref>${senderRef}</ref>
                </sender>
                <receiver>
                    <orgnr>${receiverOrgNr}</orgnr>
                    <name>${receiverOrgName}</name>
                    <email>${receiverEmail}</email>
                    <ref>${receiverRef}</ref>
                </receiver>
            </envelope>
            <payload xsi:type="xsd:string" 
                xmlns="">${message}</payload>
        </PutMessageRequest>
    </s:Body>
</s:Envelope>`
};

export default envelope;