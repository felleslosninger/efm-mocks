const getResponse = (sendersReference, receiptId, reportee, created, expires) => {


    return `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <s:Header>
      <a:Action s:mustUnderstand="1">http://www.altinn.no/services/ServiceEngine/Correspondence/2009/10/ICorrespondenceAgencyExternal/InsertCorrespondenceV2Response</a:Action>
      <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
         <u:Timestamp u:Id="_0">
            <!-- Created:  now() -->
            <u:Created>${created}</u:Created>
            <!-- now() +  5 min -->
            <u:Expires>${expires}</u:Expires>
         </u:Timestamp>
      </o:Security>
   </s:Header>
   <s:Body>
      <InsertCorrespondenceV2Response xmlns="http://www.altinn.no/services/ServiceEngine/Correspondence/2009/10">
         <InsertCorrespondenceV2Result xmlns:b="http://schemas.altinn.no/services/Intermediary/Receipt/2009/10" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <b:LastChanged>${created}</b:LastChanged>
            <b:ParentReceiptId>0</b:ParentReceiptId>
            <b:ReceiptHistory>
            ${created} - OK - Correspondence Saved Successfully            
            </b:ReceiptHistory>
            <!--  DATE NOW Apr 19 2018  9:01AM - OK - Correspondence Saved Successfully  -->
            <!--  ReceiptId er det vi lagrer i kø.  -->
            <b:ReceiptId>${receiptId}</b:ReceiptId>
            <b:ReceiptStatusCode>OK</b:ReceiptStatusCode>
            <b:ReceiptText>Correspondence Saved Successfully</b:ReceiptText>
            <b:ReceiptTypeName>Correspondence</b:ReceiptTypeName>
            <b:References>
               <b:Reference>
                  <b:ReferenceTypeName>ExternalShipmentReference</b:ReferenceTypeName>
                  <b:ReferenceValue>${sendersReference}</b:ReferenceValue>
               </b:Reference>
               <b:Reference>
                    
                  <b:ReferenceTypeName>OwnerPartyReference</b:ReferenceTypeName>
                  <!-- Reportee hentes fra ns1:Reportee, skal være et orgnummer.-->
                  <b:ReferenceValue>${reportee}</b:ReferenceValue>
               </b:Reference>
            </b:References>
            <b:SubReceipts i:nil="true"/>
         </InsertCorrespondenceV2Result>
      </InsertCorrespondenceV2Response>
   </s:Body>
</s:Envelope>
`
};

module.exports = getResponse;


