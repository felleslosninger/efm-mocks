const getEduMessage = (file, sender, receiver, conversationId) => {
    return  `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soap:Body>
      <PutMessageRequest xmlns="http://www.arkivverket.no/Noark/Exchange/types">
         <envelope xmlns="" conversationId="${conversationId}" contentNamespace="http://www.arkivverket.no/Noark4-1-WS-WD/types">
            <sender>
               <orgnr>${sender}</orgnr>
               <name>Fylkesmannen i Sogn og Fjordane</name>
               <email>fmsfpost@fylkesmannen.no</email>
               <ref>${conversationId}</ref>
            </sender>
            <receiver>
               <orgnr>${receiver}</orgnr>
               <name>Fylkesmannen i Sogn og Fjordane</name>
               <email>fmsfpost@fylkesmannen.no</email>
               <ref />
            </receiver>
         </envelope>
         <payload xmlns=""><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<Melding xmlns="http://www.arkivverket.no/Noark4-1-WS-WD/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <journpost xmlns="">
      <jpId>219816</jpId>
      <jpJaar>2015</jpJaar>
      <jpSeknr>11734</jpSeknr>
      <jpJpostnr>2</jpJpostnr>
      <jpJdato>2015-10-08</jpJdato>
      <jpNdoktype>U</jpNdoktype>
      <jpDokdato>2015-10-08</jpDokdato>
      <jpStatus>F</jpStatus>
      <jpInnhold>Test1</jpInnhold>
      <jpU1>0</jpU1>
      <jpForfdato />
      <jpTgkode />
      <jpUoff />
      <jpAgdato />
      <jpAgkode />
      <jpSaksdel />
      <jpU2>0</jpU2>
      <jpArkdel />
      <jpTlkode />
      <jpAntved>0</jpAntved>
      <jpSaar>2014</jpSaar>
      <jpSaseknr>2703</jpSaseknr>
      <jpOffinnhold>Test1</jpOffinnhold>
      <jpTggruppnavn />
      <avsmot>
         <amId>501153</amId>
         <amOrgnr>974763907</amOrgnr>
         <amIhtype>1</amIhtype>
         <amKopimot>0</amKopimot>
         <amBehansv>0</amBehansv>
         <amNavn>Fylkesmannen i Sogn og Fjordane</amNavn>
         <amU1>0</amU1>
         <amKortnavn>FMSF</amKortnavn>
         <amAdresse>Njøsavegen 2</amAdresse>
         <amPostnr>6863</amPostnr>
         <amPoststed>Leikanger</amPoststed>
         <amUtland />
         <amEpostadr>fmsfpost@fylkesmannen.no</amEpostadr>
         <amRef />
         <amJenhet />
         <amAvskm />
         <amAvskdato />
         <amFrist />
         <amForsend>D</amForsend>
         <amAdmkort></amAdmkort>
         <amAdmbet>Ufordelt/sendt tilbake til arkiv</amAdmbet>
         <amSbhinit></amSbhinit>
         <amSbhnavn>Ikke fordelt til saksbehandler</amSbhnavn>
         <amAvsavdok />
         <amBesvardok />
      </avsmot>
      <dokument>
         <dlRnr>1</dlRnr>
         <dlType>H</dlType>
         <dbKategori>ND</dbKategori>
         <dbTittel>Test1</dbTittel>
         <dbStatus>F</dbStatus>
         <veVariant>A</veVariant>
         <veDokformat>pdf</veDokformat>
         <fil><base64>${file}</base64></fil>
         <veFilnavn>test.pdf</veFilnavn>
         <veMimeType>application/pdf</veMimeType>
      </dokument>
   </journpost>
   <noarksak xmlns="">
      <saId>68286</saId>
      <saSaar>2014</saSaar>
      <saSeknr>2703</saSeknr>
      <saPapir>0</saPapir>
      <saDato>2014-11-27</saDato>
      <saTittel>Test Knutepunkt herokuapp</saTittel>
      <saU1>0</saU1>
      <saStatus>B</saStatus>
      <saArkdel>EARKIV1</saArkdel>
      <saType />
      <saJenhet>SENTRAL</saJenhet>
      <saTgkode />
      <saUoff />
      <saBevtid />
      <saKasskode />
      <saKassdato />
      <saProsjekt />
      <saOfftittel>Test Knutepunkt herokuapp</saOfftittel>
      <saAdmkort>FM-ADMA</saAdmkort>
      <saAdmbet>Administrasjon</saAdmbet>
      <saAnsvinit>JPS</saAnsvinit>
      <saAnsvnavn>John Petter Svedal</saAnsvnavn>
      <saTggruppnavn />
   </noarksak>
</Melding>]]></payload>
      </PutMessageRequest>
   </soap:Body>
</soap:Envelope>`
};

module.exports = { getEduMessage };