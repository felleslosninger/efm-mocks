const receiptRequest = (sendersReference) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Correspondence/2009/10" xmlns:ns1="http://schemas.altinn.no/services/ServiceEngine/Correspondence/2014/10">
   <soap:Header>
      <wsse:Security soap:mustUnderstand="true" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
         <wsse:UsernameToken wsu:Id="UsernameToken-1">
            <wsse:Username>AAS_TEST</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">6GMSx5n8</wsse:Password>
            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">TX5SU6e9hEm4rtNlHOF/iQ==</wsse:Nonce>
            <wsu:Created>2012-06-14T12:57:56.421Z</wsu:Created>
         </wsse:UsernameToken>
      </wsse:Security>
   </soap:Header>
   <soap:Body>
      <ns:GetCorrespondenceStatusDetailsV2>
         <ns:filterCriteria>
            <!--Optional:-->
            <ns1:CreatedAfterDate xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            <!--Optional:-->
            <ns1:CreatedBeforeDate xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            <!--Optional:-->
            
           <!--Optional:-->
            <ns1:NotificationSent xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            <!--Optional:-->
            <ns1:Reportee xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            <!--Optional:-->
            <ns1:SendersReference>${sendersReference}</ns1:SendersReference>
            <ns1:ServiceCode>4255</ns1:ServiceCode>
            <ns1:ServiceEditionCode>4</ns1:ServiceEditionCode>
         </ns:filterCriteria>
      </ns:GetCorrespondenceStatusDetailsV2>
   </soap:Body>
</soap:Envelope>
`;
};

module.exports = { receiptRequest };