function getBasicStreamedWsdl() {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <wsdl:definitions name="BrokerServiceExternalBasicStreamedSF" targetNamespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:q3="http://www.altinn.no/services/2009/10" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:q5="http://www.altinn.no/services/common/fault/2009/10" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:wsa10="http://www.w3.org/2005/08/addressing" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:tns="http://www.altinn.no/services/ServiceEngine/Broker/2015/06" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata">
          <wsdl:types>
            <xsd:schema elementFormDefault="qualified" targetNamespace="http://www.altinn.no/services/2009/10">
              <xsd:element name="Test">
                <xsd:complexType>
                  <xsd:sequence/>
                </xsd:complexType>
              </xsd:element>
              <xsd:element name="TestResponse">
                <xsd:complexType>
                  <xsd:sequence/>
                </xsd:complexType>
              </xsd:element>
            </xsd:schema>
            <xsd:schema elementFormDefault="qualified" targetNamespace="http://www.altinn.no/services/common/fault/2009/10" xmlns:tns="http://www.altinn.no/services/common/fault/2009/10">
              <xsd:complexType name="AltinnFault">
                <xsd:annotation>
                  <xsd:appinfo>
                    <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                      <d1p1:Text z:Id="2">&lt;summary&gt;
                                        Represents a SOAP fault message used by Altinn to convey exception information to the
                                        caller.
                                        &lt;/summary&gt;</d1p1:Text>
                    </Surrogate>
                  </xsd:appinfo>
                </xsd:annotation>
                <xsd:sequence>
                  <xsd:element minOccurs="0" name="AltinnErrorMessage" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the error message.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="AltinnExtendedErrorMessage" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the verbose version of the error message.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="AltinnLocalizedErrorMessage" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the localized version of the error message.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="ErrorGuid" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the unique GUID for the specific fault.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="ErrorID" type="xsd:int">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the error type id.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="UserGuid" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the GUID of the user.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                  <xsd:element minOccurs="0" name="UserId" nillable="true" type="xsd:string">
                    <xsd:annotation>
                      <xsd:appinfo>
                        <Surrogate i:type="d1p1:Annotation" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:d1p1="XmlCommentsExporter.Annotation" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/" z:Id="1">
                          <d1p1:Text z:Id="2">&lt;summary&gt;
                                                Gets or sets the id of the user.
                                                &lt;/summary&gt;</d1p1:Text>
                        </Surrogate>
                      </xsd:appinfo>
                    </xsd:annotation>
                  </xsd:element>
                </xsd:sequence>
              </xsd:complexType>
              <xsd:element name="AltinnFault" nillable="true" type="tns:AltinnFault"/>
            </xsd:schema>
            <xs:schema attributeFormDefault="qualified" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:tns="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:xs="http://www.w3.org/2001/XMLSchema">
              <xs:element name="anyType" nillable="true" type="xs:anyType"/>
              <xs:element name="anyURI" nillable="true" type="xs:anyURI"/>
              <xs:element name="base64Binary" nillable="true" type="xs:base64Binary"/>
              <xs:element name="boolean" nillable="true" type="xs:boolean"/>
              <xs:element name="byte" nillable="true" type="xs:byte"/>
              <xs:element name="dateTime" nillable="true" type="xs:dateTime"/>
              <xs:element name="decimal" nillable="true" type="xs:decimal"/>
              <xs:element name="double" nillable="true" type="xs:double"/>
              <xs:element name="float" nillable="true" type="xs:float"/>
              <xs:element name="int" nillable="true" type="xs:int"/>
              <xs:element name="long" nillable="true" type="xs:long"/>
              <xs:element name="QName" nillable="true" type="xs:QName"/>
              <xs:element name="short" nillable="true" type="xs:short"/>
              <xs:element name="string" nillable="true" type="xs:string"/>
              <xs:element name="unsignedByte" nillable="true" type="xs:unsignedByte"/>
              <xs:element name="unsignedInt" nillable="true" type="xs:unsignedInt"/>
              <xs:element name="unsignedLong" nillable="true" type="xs:unsignedLong"/>
              <xs:element name="unsignedShort" nillable="true" type="xs:unsignedShort"/>
              <xs:element name="char" nillable="true" type="tns:char"/>
              <xs:simpleType name="char">
                <xs:restriction base="xs:int"/>
              </xs:simpleType>
              <xs:element name="duration" nillable="true" type="tns:duration"/>
              <xs:simpleType name="duration">
                <xs:restriction base="xs:duration">
                  <xs:pattern value="\\-?P(\\d*D)?(T(\\d*H)?(\\d*M)?(\\d*(\\.\\d*)?S)?)?"/>
                  <xs:minInclusive value="-P10675199DT2H48M5.4775808S"/>
                  <xs:maxInclusive value="P10675199DT2H48M5.4775807S"/>
                </xs:restriction>
              </xs:simpleType>
              <xs:element name="guid" nillable="true" type="tns:guid"/>
              <xs:simpleType name="guid">
                <xs:restriction base="xs:string">
                  <xs:pattern value="[\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12}"/>
                </xs:restriction>
              </xs:simpleType>
              <xs:attribute name="FactoryType" type="xs:QName"/>
              <xs:attribute name="Id" type="xs:ID"/>
              <xs:attribute name="Ref" type="xs:IDREF"/>
            </xs:schema>
            <xsd:schema elementFormDefault="qualified" targetNamespace="http://www.altinn.no/services/ServiceEngine/Broker/2015/06">
              <xsd:import namespace="http://schemas.microsoft.com/Message"/>
              <xsd:element name="StreamedPayloadBasicBE">
                <xsd:complexType>
                  <xsd:sequence>
                    <xsd:element name="DataStream" type="q1:StreamBody" xmlns:q1="http://schemas.microsoft.com/Message"/>
                  </xsd:sequence>
                </xsd:complexType>
              </xsd:element>
              <xsd:element name="FileName" nillable="true" type="xsd:string"/>
              <xsd:element name="Reference" nillable="true" type="xsd:string"/>
              <xsd:element name="Reportee" nillable="true" type="xsd:string"/>
              <xsd:element name="SystemPassword" nillable="true" type="xsd:string"/>
              <xsd:element name="SystemUserName" nillable="true" type="xsd:string"/>
              <xsd:element name="ReceiptExternalStreamedBE">
                <xsd:complexType>
                  <xsd:sequence>
                    <xsd:element minOccurs="0" name="LastChanged" nillable="true" type="xsd:string"/>
                    <xsd:element minOccurs="0" name="ParentReceiptId" type="xsd:int"/>
                    <xsd:element minOccurs="0" name="ReceiptHistory" nillable="true" type="xsd:string"/>
                    <xsd:element minOccurs="0" name="ReceiptId" type="xsd:int"/>
                    <xsd:element minOccurs="0" name="ReceiptStatusCode" nillable="true" type="xsd:string"/>
                    <xsd:element minOccurs="0" name="ReceiptText" nillable="true" type="xsd:string"/>
                    <xsd:element minOccurs="0" name="ReceiptTypeName" nillable="true" type="xsd:string"/>
                  </xsd:sequence>
                </xsd:complexType>
              </xsd:element>
              <xsd:element name="DownloadFileStreamedBasic">
                <xsd:complexType>
                  <xsd:sequence>
                    <xsd:element minOccurs="1" name="systemUserName" type="xsd:string"/>
                    <xsd:element minOccurs="1" name="systemPassword" type="xsd:string"/>
                    <xsd:element minOccurs="1" name="fileReference" type="xsd:string"/>
                    <xsd:element minOccurs="1" name="reportee" type="xsd:string"/>
                  </xsd:sequence>
                </xsd:complexType>
              </xsd:element>
              <xsd:element name="DownloadFileStreamedBasicResponse">
                <xsd:complexType>
                  <xsd:sequence>
                    <xsd:element name="DownloadFileStreamedBasicResult" type="q2:StreamBody" xmlns:q2="http://schemas.microsoft.com/Message"/>
                  </xsd:sequence>
                </xsd:complexType>
              </xsd:element>
            </xsd:schema>
            <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/Message">
              <xsd:simpleType name="StreamBody">
                <xsd:restriction base="xsd:base64Binary"/>
              </xsd:simpleType>
            </xsd:schema>
          </wsdl:types>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_UploadFileStreamedBasic_AltinnFaultFault_FaultMessage">
            <wsdl:part name="detail" element="q5:AltinnFault">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_Test_InputMessage">
            <wsdl:part name="parameters" element="q3:Test">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_InputMessage">
            <wsdl:part name="parameters" element="tns:DownloadFileStreamedBasic">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_Test_AltinnFaultFault_FaultMessage">
            <wsdl:part name="detail" element="q5:AltinnFault">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_Test_OutputMessage">
            <wsdl:part name="parameters" element="q3:TestResponse">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_OutputMessage">
            <wsdl:part name="parameters" element="tns:DownloadFileStreamedBasicResponse">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="StreamedPayloadBasicBE">
            <wsdl:part name="parameters" element="tns:StreamedPayloadBasicBE">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_AltinnFaultFault_FaultMessage">
            <wsdl:part name="detail" element="q5:AltinnFault">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="StreamedPayloadBasicBE_Headers">
            <wsdl:part name="FileName" element="tns:FileName">
            </wsdl:part>
            <wsdl:part name="Reference" element="tns:Reference">
            </wsdl:part>
            <wsdl:part name="Reportee" element="tns:Reportee">
            </wsdl:part>
            <wsdl:part name="SystemPassword" element="tns:SystemPassword">
            </wsdl:part>
            <wsdl:part name="SystemUserName" element="tns:SystemUserName">
            </wsdl:part>
          </wsdl:message>
          <wsdl:message name="ReceiptExternalStreamedBE">
            <wsdl:part name="parameters" element="tns:ReceiptExternalStreamedBE">
            </wsdl:part>
          </wsdl:message>
          <wsdl:portType name="IBrokerServiceExternalBasicStreamed">
        <wsdl:documentation>&lt;summary&gt;
                    External interface for exposing service operations for Broker Service on basic binding.
                    Used for end user systems to handle file operations.
                    &lt;/summary&gt;</wsdl:documentation>
            <wsdl:operation name="Test">
              <wsdl:input message="tns:IBrokerServiceExternalBasicStreamed_Test_InputMessage" wsaw:Action="http://www.altinn.no/services/2009/10/IAltinnContractBase/Test">
            </wsdl:input>
              <wsdl:output message="tns:IBrokerServiceExternalBasicStreamed_Test_OutputMessage" wsaw:Action="http://www.altinn.no/services/2009/10/IAltinnContractBase/TestResponse">
            </wsdl:output>
              <wsdl:fault name="AltinnFaultFault" message="tns:IBrokerServiceExternalBasicStreamed_Test_AltinnFaultFault_FaultMessage" wsaw:Action="http://www.altinn.no/services/2009/10/IAltinnContractBase/TestAltinnFaultFault">
            </wsdl:fault>
            </wsdl:operation>
            <wsdl:operation name="UploadFileStreamedBasic">
        <wsdl:documentation><![CDATA[<summary>
                        Operation for uploading a file to a broker service.
                        </summary>
                        <param name="payload">
                        contains stream and authentication information
                        Will contain all the data for submitting a Broker Service Payload to Altinn from the EndUserSystem on
                        basic binding
                        </param>
                        <returns>
                        A ReceiptBE entity for the initiated broker service
                        </returns>]]></wsdl:documentation>
              <wsdl:input name="StreamedPayloadBasicBE" message="tns:StreamedPayloadBasicBE" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic">
            </wsdl:input>
              <wsdl:output name="ReceiptExternalStreamedBE" message="tns:ReceiptExternalStreamedBE" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasicResponse">
            </wsdl:output>
              <wsdl:fault name="AltinnFaultFault" message="tns:IBrokerServiceExternalBasicStreamed_UploadFileStreamedBasic_AltinnFaultFault_FaultMessage" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasicAltinnFaultFault">
            </wsdl:fault>
            </wsdl:operation>
            <wsdl:operation name="DownloadFileStreamedBasic">
        <wsdl:documentation><![CDATA[<summary>
                        Operation for downloading a file from a broker service.
                        </summary>
                        <param name="systemUserName">
                        System user name is the system identifier for the end user system as registered in Altinn - mandatory
                        parameter
                        </param>
                        <param name="systemPassword">
                        System password is the password for the registered end user system - mandatory parameter
                        </param>
                        <param name="fileReference">
                        The file reference value of the file that should be downloaded.
                        </param>
                        <param name="reportee">
                        The social security number or organization number of the reportee.
                        </param>
                        <returns>
                        A stream with the content of the file.
                        </returns>]]></wsdl:documentation>
              <wsdl:input message="tns:IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_InputMessage" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic">
            </wsdl:input>
              <wsdl:output message="tns:IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_OutputMessage" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasicResponse">
            </wsdl:output>
              <wsdl:fault name="AltinnFaultFault" message="tns:IBrokerServiceExternalBasicStreamed_DownloadFileStreamedBasic_AltinnFaultFault_FaultMessage" wsaw:Action="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasicAltinnFaultFault">
            </wsdl:fault>
            </wsdl:operation>
          </wsdl:portType>
          <wsdl:binding name="BasicHttpBinding_IBrokerServiceExternalBasicStreamed" type="tns:IBrokerServiceExternalBasicStreamed">
            <wsp:PolicyReference URI="#BasicHttpBinding_IBrokerServiceExternalBasicStreamed_policy"/>
            <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
            <wsdl:operation name="Test">
              <soap:operation soapAction="http://www.altinn.no/services/2009/10/IAltinnContractBase/Test" style="document"/>
              <wsdl:input>
                <soap:body use="literal"/>
              </wsdl:input>
              <wsdl:output>
                <soap:body use="literal"/>
              </wsdl:output>
              <wsdl:fault name="AltinnFaultFault">
                <soap:fault name="AltinnFaultFault" use="literal"/>
              </wsdl:fault>
            </wsdl:operation>
            <wsdl:operation name="UploadFileStreamedBasic">
              <soap:operation soapAction="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/UploadFileStreamedBasic" style="document"/>
              <wsdl:input name="StreamedPayloadBasicBE">
                <soap:header message="tns:StreamedPayloadBasicBE_Headers" part="FileName" use="literal">
                </soap:header>
                <soap:header message="tns:StreamedPayloadBasicBE_Headers" part="Reference" use="literal">
                </soap:header>
                <soap:header message="tns:StreamedPayloadBasicBE_Headers" part="Reportee" use="literal">
                </soap:header>
                <soap:header message="tns:StreamedPayloadBasicBE_Headers" part="SystemPassword" use="literal">
                </soap:header>
                <soap:header message="tns:StreamedPayloadBasicBE_Headers" part="SystemUserName" use="literal">
                </soap:header>
                <soap:body use="literal"/>
              </wsdl:input>
              <wsdl:output name="ReceiptExternalStreamedBE">
                <soap:body use="literal"/>
              </wsdl:output>
              <wsdl:fault name="AltinnFaultFault">
                <soap:fault name="AltinnFaultFault" use="literal"/>
              </wsdl:fault>
            </wsdl:operation>
            <wsdl:operation name="DownloadFileStreamedBasic">
              <soap:operation soapAction="http://www.altinn.no/services/ServiceEngine/Broker/2015/06/IBrokerServiceExternalBasicStreamed/DownloadFileStreamedBasic" style="document"/>
              <wsdl:input>
                <soap:body use="literal"/>
              </wsdl:input>
              <wsdl:output>
                <soap:body use="literal"/>
              </wsdl:output>
              <wsdl:fault name="AltinnFaultFault">
                <soap:fault name="AltinnFaultFault" use="literal"/>
              </wsdl:fault>
            </wsdl:operation>
          </wsdl:binding>
          <wsdl:service name="BrokerServiceExternalBasicStreamedSF">
            <wsdl:port name="BasicHttpBinding_IBrokerServiceExternalBasicStreamed" binding="tns:BasicHttpBinding_IBrokerServiceExternalBasicStreamed">
              <soap:address location="http://MacBook-Pro.local:8089/"/>
            </wsdl:port>
          </wsdl:service>
            <wsp:Policy wsu:Id="BasicHttpBinding_IBrokerServiceExternalBasicStreamed_policy">
            <wsp:ExactlyOne>
              <wsp:All>
                <wsoma:OptimizedMimeSerialization xmlns:wsoma="http://schemas.xmlsoap.org/ws/2004/09/policy/optimizedmimeserialization"/>
              </wsp:All>
            </wsp:ExactlyOne>
          </wsp:Policy>
        </wsdl:definitions>`
}

module.exports = { getBasicStreamedWsdl };