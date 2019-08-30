import moment from "moment/moment";


function padAndDate(number){
    return `${new moment().format('YY')}/${number.padStart(5, "0")}`;
}

let payload = (jpId, jpJaar, jpSeknr, jpJpostnr, jpJdato, jpDokdato,
               amOrgnr, amNavn, saSaar, saSeknr, saDato,
               saArkdel, dbTittel, saOfftittel, fil, jpInnhold) => {

    return `<?xml version="1.0" encoding="utf-8"?>
                <Melding xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.arkivverket.no/Noark4-1-WS-WD/types">
                  <journpost xmlns="">
                    <jpId>${jpId}</jpId>
                    <jpJaar>${jpJaar}</jpJaar>
                    <jpSeknr>${jpSeknr}</jpSeknr>
                    <jpJpostnr>${jpJpostnr}</jpJpostnr>
                    <jpJdato>${jpJdato}</jpJdato>
                    <jpNdoktype>U</jpNdoktype>
                    <jpDokdato>${jpDokdato}</jpDokdato>
                    <jpStatus>R</jpStatus>
                    <jpInnhold>${jpInnhold}</jpInnhold>
                    <jpForfdato />
                    <jpTgkode>U</jpTgkode>
                    <jpAgdato />
                    <jpAntved>1</jpAntved>
                    <jpSaar>${saSaar}</jpSaar>
                    <jpSaseknr>${saSeknr}</jpSaseknr>
                    <jpOffinnhold>{Hentes fra tittelfelt på webside}</jpOffinnhold>
                    <jpTggruppnavn>Alle</jpTggruppnavn>
                    <avsmot>
                      <amIhtype>0</amIhtype>
                      <amNavn>eFormidling test</amNavn>
                      <amAdresse>Postboks 8115 Dep.</amAdresse>
                      <amPostnr>0032</amPostnr>
                      <amPoststed>OSLO</amPoststed>
                      <amUtland>Norge</amUtland>
                      <amEpostadr></amEpostadr>
                    </avsmot>
                    <avsmot>
                      <amOrgnr>${amOrgnr}</amOrgnr>
                      <amIhtype>1</amIhtype>
                      <amNavn>${amNavn}</amNavn>
                    </avsmot>
                    <dokument>
                      <dlRnr>1</dlRnr>
                      <dlType>H</dlType>
                      <dbTittel>${dbTittel}</dbTittel>
                      <dbStatus>B</dbStatus>
                      <veVariant>P</veVariant>
                      <veDokformat>{kommer tilbake til denne}</veDokformat>
                      <fil>
                        <base64>${fil || 'Fil her'}</base64>
                      </fil>
                      <veFilnavn>Testdokument.PDF</veFilnavn>
                      <veMimeType>{kommer tilbake til denne}</veMimeType>
                    </dokument>
                  </journpost>
                  <noarksak xmlns="">
                    <saId>${padAndDate(`${saSeknr}`)}</saId>
                    <saSaar>${saSaar}</saSaar>
                    <saSeknr>${saSeknr}</saSeknr>
                    <saPapir>0</saPapir>
                    <saDato>${saDato}</saDato>
                    <saTittel>${saOfftittel}</saTittel>
                    <saStatus>R</saStatus>
                    <saArkdel>${saArkdel}</saArkdel>
                    <saType>Sak</saType>
                    <saJenhet>Oslo</saJenhet>
                    <saTgkode>U</saTgkode>
                    <saBevtid />
                    <saKasskode>B</saKasskode>
                    <saOfftittel>${saOfftittel}</saOfftittel>
                    <saAdmkort>202286</saAdmkort>
                    <saAdmbet>Seksjon for systemutvikling</saAdmbet>
                    <saAnsvinit>difi\\sa-user-test2</saAnsvinit>
                    <saAnsvnavn>eFormidling test</saAnsvnavn>
                    <saTggruppnavn>Alle</saTggruppnavn>
                    <sakspart>
                      <spId>0</spId>
                    </sakspart>
                  </noarksak>
                </Melding>`
};

export default payload;