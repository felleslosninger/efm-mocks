getDpvTestResponse = () => {

    return `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <s:Header>
      <a:Action s:mustUnderstand="1">http://www.altinn.no/services/2009/10/IAltinnContractBase/TestResponse</a:Action>
      <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
         <u:Timestamp u:Id="_0">
            <u:Created>2019-10-16T08:29:45.131Z</u:Created>
            <u:Expires>2019-10-16T08:34:45.131Z</u:Expires>
         </u:Timestamp>
      </o:Security>
      </s:Header>
      <s:Body>
          <TestResponse xmlns="http://www.altinn.no/services/2009/10"/>
      </s:Body>
      </s:Envelope>`
};

module.exports = { getDpvTestResponse };