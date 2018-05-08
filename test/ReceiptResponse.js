getReceiptResponse = (sendersReference, reportee, created, expires) => {
    return `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <s:Header>
      <a:Action s:mustUnderstand="1">http://www.altinn.no/services/ServiceEngine/Correspondence/2009/10/ICorrespondenceAgencyExternal/GetCorrespondenceStatusDetailsV2Response</a:Action>
      <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
         <u:Timestamp u:Id="_0" >
         <!-- Created er timestamp fra da vi lagrer i db. -->
            <u:Created>2018-05-04T12:24:23.205Z</u:Created>
            <u:Expires>2018-05-04T12:29:23.205Z</u:Expires>
         </u:Timestamp>
      </o:Security>
   </s:Header>
   <s:Body>
      <GetCorrespondenceStatusDetailsV2Response xmlns="http://www.altinn.no/services/ServiceEngine/Correspondence/2009/10">
         <GetCorrespondenceStatusDetailsV2Result xmlns:b="http://schemas.altinn.no/services/ServiceEngine/Correspondence/2014/10" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <b:LimitReached>false</b:LimitReached>
            <b:ServiceCode>4255</b:ServiceCode>
            <b:ServiceEditionCode>4</b:ServiceEditionCode>
            <b:StatusList>
               <b:StatusV2>
               <!--  CorrespondenceID hentes fra database -->
                  <b:CorrespondenceID>2947590</b:CorrespondenceID>
                  <b:CreatedDate>2015-11-18T09:44:26.417</b:CreatedDate>
                  <b:Notifications xmlns:c="http://schemas.altinn.no/services/ServiceEngine/Correspondence/2013/11">
                     <c:Notification>
                     <!-- Skift til dummy epost  -->
                        <c:Recipient>test@example.com</c:Recipient>
                        <c:SentDate>2015-11-18T09:47:01.573</c:SentDate>
                        <c:TransportType>Email</c:TransportType>
                     </c:Notification>
                     <c:Notification>
                        <c:Recipient>test@example.com</c:Recipient>
                        <c:SentDate>2015-11-18T09:47:02.073</c:SentDate>
                        <c:TransportType>Email</c:TransportType>
                     </c:Notification>
                  </b:Notifications>
                  <b:Reportee>${reportee}</b:Reportee>
                  
                  <!-- sendersReference kommer fra spørring, vi slår opp i DB for å hente CorrespondenceID -->
                  <b:SendersReference>${sendersReference}</b:SendersReference>
                  <b:StatusChanges>
                     <b:StatusChangeV2>
                        <b:StatusDate>2015-11-18T09:44:26.473</b:StatusDate>
                        <b:StatusType>Created</b:StatusType>
                     </b:StatusChangeV2>
                     <b:StatusChangeV2>
                        <b:StatusDate>2015-11-18T09:56:20.41</b:StatusDate>
                        <b:StatusType>Read</b:StatusType>
                     </b:StatusChangeV2>
                  </b:StatusChanges>
               </b:StatusV2>
            </b:StatusList>
         </GetCorrespondenceStatusDetailsV2Result>
      </GetCorrespondenceStatusDetailsV2Response>
   </s:Body>
</s:Envelope>`
};

module.exports = { getReceiptResponse };