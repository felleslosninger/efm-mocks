function GetAvailableFilesBasic(){
    return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
              <s:Body>
                <GetAvailableFilesBasicResponse xmlns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
                  <GetAvailableFilesBasicResult xmlns:a="http://schemas.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"/>
                </GetAvailableFilesBasicResponse>
              </s:Body>
            </s:Envelope>`;
}

function InitiateBrokerServiceBasic(){
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
               <soapenv:Header/>
               <soapenv:Body>
                  <ns:InitiateBrokerServiceBasicResponse>
                  </ns:InitiateBrokerServiceBasicResponse>
               </soapenv:Body>
            </soapenv:Envelope>`;
}

function DownloadFileStreamedBasic(){
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
               <soapenv:Header/>
               <soapenv:Body>
                  <ns:DownloadFileStreamedBasicResponse>
                     <ns:DownloadFileStreamedBasicResult>cid:1353767272596</ns:DownloadFileStreamedBasicResult>
                  </ns:DownloadFileStreamedBasicResponse>
               </soapenv:Body>
            </soapenv:Envelope>`;
}

function UploadFileStreamedBasic(){
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
               <soapenv:Header/>
               <soapenv:Body>
                  <ns:ReceiptExternalStreamedBE>
                     <!--Optional:-->
                     <ns:LastChanged>?</ns:LastChanged>
                     <!--Optional:-->
                     <ns:ParentReceiptId>?</ns:ParentReceiptId>
                     <!--Optional:-->
                     <ns:ReceiptHistory>?</ns:ReceiptHistory>
                     <!--Optional:-->
                     <ns:ReceiptId>?</ns:ReceiptId>
                     <!--Optional:-->
                     <ns:ReceiptStatusCode>?</ns:ReceiptStatusCode>
                     <!--Optional:-->
                     <ns:ReceiptText>?</ns:ReceiptText>
                     <!--Optional:-->
                     <ns:ReceiptTypeName>?</ns:ReceiptTypeName>
                  </ns:ReceiptExternalStreamedBE>
               </soapenv:Body>
            </soapenv:Envelope>`
}

module.exports = {  GetAvailableFilesBasic, InitiateBrokerServiceBasic, DownloadFileStreamedBasic, UploadFileStreamedBasic };