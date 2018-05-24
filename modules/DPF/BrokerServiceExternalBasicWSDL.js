getBrokerServiceExternalBasicWSDL = function () {
    return `<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions name="ForsendelsesServiceV9" targetNamespace="http://www.ks.no/svarut/servicesV9" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:tns="http://www.ks.no/svarut/servicesV9" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:ns1="http://schemas.xmlsoap.org/soap/http" xmlns:soaphttp="http://schemas.xmlsoap.org/wsdl/soap/">
  <wsdl:types>
    <xs:schema elementFormDefault="unqualified" targetNamespace="http://www.ks.no/svarut/servicesV9" version="1.0" xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:import namespace="http://www.w3.org/2005/05/xmlmime"/>
      <xs:element name="retreiveForsendelseTyper" type="tns:retreiveForsendelseTyper"/>
      <xs:element name="retreiveForsendelseTyperResponse" type="tns:retreiveForsendelseTyperResponse"/>
      <xs:element name="retrieveForsendelseHistorikk" type="tns:retrieveForsendelseHistorikk"/>
      <xs:element name="retrieveForsendelseHistorikkResponse" type="tns:retrieveForsendelseHistorikkResponse"/>
      <xs:element name="retrieveForsendelseIdByEksternRef" type="tns:retrieveForsendelseIdByEksternRef"/>
      <xs:element name="retrieveForsendelseIdByEksternRefResponse" type="tns:retrieveForsendelseIdByEksternRefResponse"/>
      <xs:element name="retrieveForsendelseStatus" type="tns:retrieveForsendelseStatus"/>
      <xs:element name="retrieveForsendelseStatusResponse" type="tns:retrieveForsendelseStatusResponse"/>
      <xs:element name="retrieveForsendelseStatuser" type="tns:retrieveForsendelseStatuser"/>
      <xs:element name="retrieveForsendelseStatuserResponse" type="tns:retrieveForsendelseStatuserResponse"/>
      <xs:element name="retrieveMottakerSystemForOrgnr" type="tns:retrieveMottakerSystemForOrgnr"/>
      <xs:element name="retrieveMottakerSystemForOrgnrResponse" type="tns:retrieveMottakerSystemForOrgnrResponse"/>
      <xs:element name="retrieveSigneringshistorikk" type="tns:retrieveSigneringshistorikk"/>
      <xs:element name="retrieveSigneringshistorikkForFlereForsendelser" type="tns:retrieveSigneringshistorikkForFlereForsendelser"/>
      <xs:element name="retrieveSigneringshistorikkForFlereForsendelserResponse" type="tns:retrieveSigneringshistorikkForFlereForsendelserResponse"/>
      <xs:element name="retrieveSigneringshistorikkResponse" type="tns:retrieveSigneringshistorikkResponse"/>
      <xs:element name="sendForsendelse" type="tns:sendForsendelse"/>
      <xs:element name="sendForsendelseMedId" type="tns:sendForsendelseMedId"/>
      <xs:element name="sendForsendelseMedIdResponse" type="tns:sendForsendelseMedIdResponse"/>
      <xs:element name="sendForsendelseResponse" type="tns:sendForsendelseResponse"/>
      <xs:element name="setForsendelseLestAvEksterntSystem" type="tns:setForsendelseLestAvEksterntSystem"/>
      <xs:element name="setForsendelseLestAvEksterntSystemResponse" type="tns:setForsendelseLestAvEksterntSystemResponse"/>
      <xs:element name="startNyForsendelse" type="tns:startNyForsendelse"/>
      <xs:element name="startNyForsendelseResponse" type="tns:startNyForsendelseResponse"/>
      <xs:complexType name="retrieveForsendelseIdByEksternRef">
        <xs:sequence>
          <xs:element minOccurs="0" name="eksternRef" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseIdByEksternRefResponse">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="return" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseStatuser">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="forsendelseider" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseStatuserResponse">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:statusResult"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="statusResult">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelseStatus" type="tns:forsendelseStatus"/>
          <xs:element minOccurs="0" name="forsendelsesid" type="xs:string"/>
          <xs:element minOccurs="0" name="sisteStatusEndring" type="xs:dateTime"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="sendForsendelse">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelse" type="tns:forsendelse"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="forsendelse">
        <xs:sequence>
          <xs:element minOccurs="0" name="avgivendeSystem" type="xs:string"/>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="dokumenter" nillable="true" type="tns:dokument"/>
          <xs:element minOccurs="0" name="eksternref" type="xs:string"/>
          <xs:element minOccurs="0" name="forsendelseType" type="xs:string"/>
          <xs:element minOccurs="0" name="konteringskode" type="xs:string"/>
          <xs:element name="krevNiva4Innlogging" type="xs:boolean"/>
          <xs:element name="kryptert" type="xs:boolean"/>
          <xs:element name="kunDigitalLevering" type="xs:boolean"/>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="lenker" nillable="true" type="tns:lenke"/>
          <xs:element minOccurs="0" name="metadataForImport" type="tns:noarkMetadataForImport"/>
          <xs:element minOccurs="0" name="metadataFraAvleverendeSystem" type="tns:noarkMetadataFraAvleverendeSakssystem"/>
          <xs:element minOccurs="0" name="mottaker" type="tns:adresse"/>
          <xs:element minOccurs="0" name="printkonfigurasjon" type="tns:printkonfigurasjon"/>
          <xs:element name="signaturtype" nillable="true" type="tns:signaturType"/>
          <xs:element name="signeringUtloper" nillable="true" type="xs:dateTime"/>
          <xs:element minOccurs="0" name="svarPaForsendelse" type="xs:string"/>
          <xs:element name="svarPaForsendelseLink" type="xs:boolean"/>
          <xs:element minOccurs="0" name="svarSendesTil" type="tns:adresse"/>
          <xs:element name="tittel" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="dokument">
        <xs:sequence>
          <xs:element name="data" type="xs:base64Binary" xmime:expectedContentTypes="application/octet-stream"/>
          <xs:element minOccurs="0" name="dokumentType" type="xs:string"/>
          <xs:element name="ekskluderesFraPrint" type="xs:boolean"/>
          <xs:element name="filnavn" type="xs:string"/>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="giroarkSider" nillable="true" type="xs:int"/>
          <xs:element name="mimetype" type="xs:string"/>
          <xs:element name="skalSigneres" type="xs:boolean"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="lenke">
        <xs:sequence>
          <xs:element minOccurs="0" name="ledetekst" type="xs:string"/>
          <xs:element minOccurs="0" name="urlLenke" type="xs:string"/>
          <xs:element minOccurs="0" name="urlTekst" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="noarkMetadataForImport">
        <xs:sequence>
          <xs:element minOccurs="0" name="dokumentetsDato" type="xs:dateTime"/>
          <xs:element minOccurs="0" name="journalposttype" type="xs:string"/>
          <xs:element minOccurs="0" name="journalstatus" type="xs:string"/>
          <xs:element name="saksaar" type="xs:int"/>
          <xs:element name="sakssekvensnummer" type="xs:int"/>
          <xs:element minOccurs="0" name="tittel" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="noarkMetadataFraAvleverendeSakssystem">
        <xs:sequence>
          <xs:element minOccurs="0" name="dokumentetsDato" type="xs:dateTime"/>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="ekstraMetadata" nillable="true" type="tns:entry"/>
          <xs:element name="journalaar" type="xs:int"/>
          <xs:element minOccurs="0" name="journaldato" type="xs:dateTime"/>
          <xs:element name="journalpostnummer" type="xs:int"/>
          <xs:element minOccurs="0" name="journalposttype" type="xs:string"/>
          <xs:element name="journalsekvensnummer" type="xs:int"/>
          <xs:element minOccurs="0" name="journalstatus" type="xs:string"/>
          <xs:element name="saksaar" type="xs:int"/>
          <xs:element minOccurs="0" name="saksbehandler" type="xs:string"/>
          <xs:element name="sakssekvensnummer" type="xs:int"/>
          <xs:element minOccurs="0" name="tittel" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="entry">
        <xs:sequence>
          <xs:element minOccurs="0" name="key" type="xs:string"/>
          <xs:element minOccurs="0" name="value" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="adresse">
        <xs:sequence>
          <xs:element minOccurs="0" name="digitalAdresse" type="tns:digitalAdresse"/>
          <xs:element minOccurs="0" name="postAdresse" type="tns:postAdresse"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType abstract="true" name="digitalAdresse">
        <xs:sequence/>
      </xs:complexType>
      <xs:complexType name="organisasjonDigitalAdresse">
        <xs:complexContent>
          <xs:extension base="tns:digitalAdresse">
            <xs:sequence>
              <xs:element minOccurs="0" name="orgnr" type="xs:string"/>
            </xs:sequence>
          </xs:extension>
        </xs:complexContent>
      </xs:complexType>
      <xs:complexType name="personDigitalAdresse">
        <xs:complexContent>
          <xs:extension base="tns:digitalAdresse">
            <xs:sequence>
              <xs:element minOccurs="0" name="fnr" type="xs:string"/>
            </xs:sequence>
          </xs:extension>
        </xs:complexContent>
      </xs:complexType>
      <xs:complexType name="postAdresse">
        <xs:sequence>
          <xs:element minOccurs="0" name="adresse1" type="xs:string"/>
          <xs:element minOccurs="0" name="adresse2" type="xs:string"/>
          <xs:element minOccurs="0" name="adresse3" type="xs:string"/>
          <xs:element minOccurs="0" name="land" type="xs:string"/>
          <xs:element minOccurs="0" name="navn" type="xs:string"/>
          <xs:element minOccurs="0" name="postnr" type="xs:string"/>
          <xs:element minOccurs="0" name="poststed" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="printkonfigurasjon">
        <xs:sequence>
          <xs:element minOccurs="0" name="brevtype" type="tns:brevtype"/>
          <xs:element name="fargePrint" type="xs:boolean"/>
          <xs:element name="tosidig" type="xs:boolean"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="sendForsendelseResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveMottakerSystemForOrgnr">
        <xs:sequence>
          <xs:element minOccurs="0" name="organisasjonsnr" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveMottakerSystemForOrgnrResponse">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:mottakerForsendelseTyper"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="mottakerForsendelseTyper">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelseType" type="xs:string"/>
          <xs:element minOccurs="0" name="mottakerid" type="xs:string"/>
          <xs:element minOccurs="0" name="mottakersystem" type="xs:string"/>
          <xs:element name="niva" type="xs:int"/>
          <xs:element minOccurs="0" name="orgnr" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="sendForsendelseMedId">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelse" type="tns:forsendelse"/>
          <xs:element minOccurs="0" name="forsendelsesid" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="sendForsendelseMedIdResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveSigneringshistorikk">
        <xs:sequence>
          <xs:element name="forsendelseid" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveSigneringshistorikkResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="tns:signeringshistorikk"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="signeringshistorikk">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelseid" type="xs:string"/>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="logg" type="tns:signeringslogg"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="signeringslogg">
        <xs:sequence>
          <xs:element minOccurs="0" name="tidspunkt" type="xs:string"/>
          <xs:element minOccurs="0" name="type" type="xs:string"/>
          <xs:element minOccurs="0" name="hendelse" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseHistorikk">
        <xs:sequence>
          <xs:element name="forsendelsesid" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseHistorikkResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="tns:forsendelseHistorikk"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="forsendelseHistorikk">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="hendelsesLogg" nillable="true" type="tns:hendelsesLogg"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="hendelsesLogg">
        <xs:sequence>
          <xs:element minOccurs="0" name="hendelse" type="xs:string"/>
          <xs:element minOccurs="0" name="tidspunkt" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retreiveForsendelseTyper">
        <xs:sequence/>
      </xs:complexType>
      <xs:complexType name="retreiveForsendelseTyperResponse">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="return" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveSigneringshistorikkForFlereForsendelser">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" name="forsendelseider" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveSigneringshistorikkForFlereForsendelserResponse">
        <xs:sequence>
          <xs:element maxOccurs="unbounded" minOccurs="0" name="return" type="tns:signeringshistorikk"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="setForsendelseLestAvEksterntSystem">
        <xs:sequence>
          <xs:element minOccurs="0" name="forsendelsesid" type="xs:string"/>
          <xs:element minOccurs="0" name="lestAvFodselsnummer" type="xs:string"/>
          <xs:element minOccurs="0" name="navnPaEksterntSystem" type="xs:string"/>
          <xs:element minOccurs="0" name="datoLest" type="xs:dateTime"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="setForsendelseLestAvEksterntSystemResponse">
        <xs:sequence/>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseStatus">
        <xs:sequence>
          <xs:element name="forsendelsesid" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="retrieveForsendelseStatusResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="tns:forsendelseStatus"/>
        </xs:sequence>
      </xs:complexType>
      <xs:complexType name="startNyForsendelse">
        <xs:sequence/>
      </xs:complexType>
      <xs:complexType name="startNyForsendelseResponse">
        <xs:sequence>
          <xs:element minOccurs="0" name="return" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>
      <xs:simpleType name="forsendelseStatus">
        <xs:restriction base="xs:string">
          <xs:enumeration value="MOTTATT"/>
          <xs:enumeration value="AKSEPTERT"/>
          <xs:enumeration value="AVVIST"/>
          <xs:enumeration value="VARSLET"/>
          <xs:enumeration value="LEST"/>
          <xs:enumeration value="SENDT_PRINT"/>
          <xs:enumeration value="PRINTET"/>
          <xs:enumeration value="MANUELT_HANDTERT"/>
          <xs:enumeration value="SENDT_DIGITALT"/>
          <xs:enumeration value="SENDT_SDP"/>
          <xs:enumeration value="LEVERT_SDP"/>
          <xs:enumeration value="KLAR_FOR_MOTTAK"/>
          <xs:enumeration value="IKKE_LEVERT"/>
        </xs:restriction>
      </xs:simpleType>
      <xs:simpleType name="brevtype">
        <xs:restriction base="xs:string">
          <xs:enumeration value="APOST"/>
          <xs:enumeration value="BPOST"/>
        </xs:restriction>
      </xs:simpleType>
      <xs:simpleType name="signaturType">
        <xs:restriction base="xs:string">
          <xs:enumeration value="AUTENTISERT_SIGNATUR"/>
          <xs:enumeration value="AVANSERT_SIGNATUR"/>
        </xs:restriction>
      </xs:simpleType>
    </xs:schema>
  </wsdl:types>
  <wsdl:message name="retrieveForsendelseIdByEksternRef">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseIdByEksternRef">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveSigneringshistorikkForFlereForsendelserResponse">
    <wsdl:part name="parameters" element="tns:retrieveSigneringshistorikkForFlereForsendelserResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseIdByEksternRefResponse">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseIdByEksternRefResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseStatuser">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseStatuser">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseHistorikkResponse">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseHistorikkResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="sendForsendelse">
    <wsdl:part name="parameters" element="tns:sendForsendelse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveMottakerSystemForOrgnr">
    <wsdl:part name="parameters" element="tns:retrieveMottakerSystemForOrgnr">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="sendForsendelseMedId">
    <wsdl:part name="parameters" element="tns:sendForsendelseMedId">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveSigneringshistorikk">
    <wsdl:part name="parameters" element="tns:retrieveSigneringshistorikk">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseHistorikk">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseHistorikk">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retreiveForsendelseTyper">
    <wsdl:part name="parameters" element="tns:retreiveForsendelseTyper">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="sendForsendelseMedIdResponse">
    <wsdl:part name="parameters" element="tns:sendForsendelseMedIdResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseStatusResponse">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseStatusResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveSigneringshistorikkForFlereForsendelser">
    <wsdl:part name="parameters" element="tns:retrieveSigneringshistorikkForFlereForsendelser">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="sendForsendelseResponse">
    <wsdl:part name="parameters" element="tns:sendForsendelseResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retreiveForsendelseTyperResponse">
    <wsdl:part name="parameters" element="tns:retreiveForsendelseTyperResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="startNyForsendelseResponse">
    <wsdl:part name="parameters" element="tns:startNyForsendelseResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveMottakerSystemForOrgnrResponse">
    <wsdl:part name="parameters" element="tns:retrieveMottakerSystemForOrgnrResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="setForsendelseLestAvEksterntSystem">
    <wsdl:part name="parameters" element="tns:setForsendelseLestAvEksterntSystem">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveSigneringshistorikkResponse">
    <wsdl:part name="parameters" element="tns:retrieveSigneringshistorikkResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseStatus">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseStatus">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="startNyForsendelse">
    <wsdl:part name="parameters" element="tns:startNyForsendelse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="retrieveForsendelseStatuserResponse">
    <wsdl:part name="parameters" element="tns:retrieveForsendelseStatuserResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:message name="setForsendelseLestAvEksterntSystemResponse">
    <wsdl:part name="parameters" element="tns:setForsendelseLestAvEksterntSystemResponse">
    </wsdl:part>
  </wsdl:message>
  <wsdl:portType name="ForsendelsesServiceV9">
    <wsdl:operation name="retrieveForsendelseIdByEksternRef">
      <wsdl:input name="retrieveForsendelseIdByEksternRef" message="tns:retrieveForsendelseIdByEksternRef">
    </wsdl:input>
      <wsdl:output name="retrieveForsendelseIdByEksternRefResponse" message="tns:retrieveForsendelseIdByEksternRefResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseStatuser">
      <wsdl:input name="retrieveForsendelseStatuser" message="tns:retrieveForsendelseStatuser">
    </wsdl:input>
      <wsdl:output name="retrieveForsendelseStatuserResponse" message="tns:retrieveForsendelseStatuserResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="sendForsendelse">
      <wsdl:input name="sendForsendelse" message="tns:sendForsendelse">
    </wsdl:input>
      <wsdl:output name="sendForsendelseResponse" message="tns:sendForsendelseResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveMottakerSystemForOrgnr">
      <wsdl:input name="retrieveMottakerSystemForOrgnr" message="tns:retrieveMottakerSystemForOrgnr">
    </wsdl:input>
      <wsdl:output name="retrieveMottakerSystemForOrgnrResponse" message="tns:retrieveMottakerSystemForOrgnrResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="sendForsendelseMedId">
      <wsdl:input name="sendForsendelseMedId" message="tns:sendForsendelseMedId">
    </wsdl:input>
      <wsdl:output name="sendForsendelseMedIdResponse" message="tns:sendForsendelseMedIdResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveSigneringshistorikk">
      <wsdl:input name="retrieveSigneringshistorikk" message="tns:retrieveSigneringshistorikk">
    </wsdl:input>
      <wsdl:output name="retrieveSigneringshistorikkResponse" message="tns:retrieveSigneringshistorikkResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseHistorikk">
      <wsdl:input name="retrieveForsendelseHistorikk" message="tns:retrieveForsendelseHistorikk">
    </wsdl:input>
      <wsdl:output name="retrieveForsendelseHistorikkResponse" message="tns:retrieveForsendelseHistorikkResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retreiveForsendelseTyper">
      <wsdl:input name="retreiveForsendelseTyper" message="tns:retreiveForsendelseTyper">
    </wsdl:input>
      <wsdl:output name="retreiveForsendelseTyperResponse" message="tns:retreiveForsendelseTyperResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveSigneringshistorikkForFlereForsendelser">
      <wsdl:input name="retrieveSigneringshistorikkForFlereForsendelser" message="tns:retrieveSigneringshistorikkForFlereForsendelser">
    </wsdl:input>
      <wsdl:output name="retrieveSigneringshistorikkForFlereForsendelserResponse" message="tns:retrieveSigneringshistorikkForFlereForsendelserResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="setForsendelseLestAvEksterntSystem">
      <wsdl:input name="setForsendelseLestAvEksterntSystem" message="tns:setForsendelseLestAvEksterntSystem">
    </wsdl:input>
      <wsdl:output name="setForsendelseLestAvEksterntSystemResponse" message="tns:setForsendelseLestAvEksterntSystemResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseStatus">
      <wsdl:input name="retrieveForsendelseStatus" message="tns:retrieveForsendelseStatus">
    </wsdl:input>
      <wsdl:output name="retrieveForsendelseStatusResponse" message="tns:retrieveForsendelseStatusResponse">
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="startNyForsendelse">
      <wsdl:input name="startNyForsendelse" message="tns:startNyForsendelse">
    </wsdl:input>
      <wsdl:output name="startNyForsendelseResponse" message="tns:startNyForsendelseResponse">
    </wsdl:output>
    </wsdl:operation>
  </wsdl:portType>
  <wsdl:binding name="ForsendelsesServiceV9SoapBinding" type="tns:ForsendelsesServiceV9">
    <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="retrieveForsendelseIdByEksternRef">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveForsendelseIdByEksternRef">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveForsendelseIdByEksternRefResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseStatuser">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveForsendelseStatuser">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveForsendelseStatuserResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="sendForsendelse">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="sendForsendelse">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="sendForsendelseResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveMottakerSystemForOrgnr">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveMottakerSystemForOrgnr">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveMottakerSystemForOrgnrResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="sendForsendelseMedId">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="sendForsendelseMedId">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="sendForsendelseMedIdResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveSigneringshistorikk">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveSigneringshistorikk">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveSigneringshistorikkResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseHistorikk">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveForsendelseHistorikk">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveForsendelseHistorikkResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retreiveForsendelseTyper">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retreiveForsendelseTyper">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retreiveForsendelseTyperResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveSigneringshistorikkForFlereForsendelser">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveSigneringshistorikkForFlereForsendelser">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveSigneringshistorikkForFlereForsendelserResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="setForsendelseLestAvEksterntSystem">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="setForsendelseLestAvEksterntSystem">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="setForsendelseLestAvEksterntSystemResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="retrieveForsendelseStatus">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="retrieveForsendelseStatus">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="retrieveForsendelseStatusResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="startNyForsendelse">
      <soap12:operation soapAction="" style="document"/>
      <wsdl:input name="startNyForsendelse">
        <soap12:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="startNyForsendelseResponse">
        <soap12:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
  </wsdl:binding>
  <wsdl:service name="ForsendelsesServiceV9">
    <wsdl:port name="ForsendelsesServiceV9" binding="tns:ForsendelsesServiceV9SoapBinding">
      <soap12:address location="http://MacBook-Pro.local:8080/"/>
    </wsdl:port>
  </wsdl:service>
</wsdl:definitions>`
};

module.exports = { getBrokerServiceExternalBasicWSDL };