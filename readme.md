## MoveMocks

MoveMocks lar deg simulere de forskjellige meldingsformidlertjenestene.

![alt text](images/MockContainers.png "Container diagram")


### Forutsetninger

* Docker
* Integrasjonspunkt


### Oppstart

Dersom du skal kjøre DPI mocken må du utføre følgende skritt før docker-compose up:

1. ``` git clone https://github.com/difi/move-mocks.git ```
2. Bygg dpimock prosjektet: ``` cd move-mocks/dpimock && ./mvnw install dockerfile:build ```
5. Pass på at ingenting kjører på følgende porter: 9093, 8001, 8002 og 8080, eller spesifiser porter .env filen.
6. Kjør ``` docker-compose up ``` i roten av prosjektet. 

Du har nå følgende applikasjoner kjørende:

* localhost:8090: Wiremock - Simulerer SR.
* localhost:8080: DPI mock.
* localhost:8001: DPO, DPV, DPF, og DPE mock.
* localhost:8002: Sak/arkivsystem mock.

På localhost:8001 finner du et lite gui der du kan se meldinger som har blitt sendt vellykket.


### Oppsett


#### Integrasjonspunkt

1. Kopier ```move-mocks/dpimock/src/main/resources/altinn.jks```, ```move-mocks/dpimock/src/main/resources/demo.jks``` og ```move-mocks/kontaktinfo-client.pem``` inn i mappen med integrasjonspunktet..
2. Kopier filen integrasjonspunkt-local.properties inn i mappen med integrasjonspunktet.
3. Skift ut feltene merket <path_to> med path til de respektive filene. (feks: difi.move.org.keystore.path=file:altinn.jks om du utførte steg 1)
3. Start integrasjonspunktet. 

#### Sende meldinger

Mocken er satt opp til å motta meldinger for følgende org nr og prosesser:

| Meldingstype         | Mottaker    | Prosess                                                     | Dokumenttype                                 |
|----------------------|-------------|-------------------------------------------------------------|----------------------------------------------|
| DPI                  | 06068700602 | urn:no:difi:profile:digitalpost:info:ver1.0                 | urn:no:difi:digitalpost:xsd:digital::digital |
| DPE Journal          | 910076787   | urn:no:difi:profile:einnsyn:journalpost:ver1.0              | urn:no:difi:einnsyn:xsd::publisering         |
| DPE Innsynsbegjæring | 910076787   | urn:no:difi:profile:einnsyn:innsynskrav:ver1.0              | urn:no:difi:einnsyn:xsd::innsynskrav         |
| DPE Møte             | 910076787   | urn:no:difi:profile:einnsyn:meeting:ver1.0                  | urn:no:difi:einnsyn:xsd::publisering         |
| DPO                  | 991825827   | urn:no:difi:profile:arkivmelding:administrasjon:ver1.0      | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPV                  | 991825827   | urn:no:difi:profile:arkivmelding:helseSosialOgOmsorg:ver1.0 | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPF                  | 991825827   | urn:no:difi:profile:arkivmelding:planByggOgGeodata:ver1.0   | urn:no:difi:arkivmelding:xsd::arkivmelding   |

#### Kjør mocks uten docker

1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.

2. ``` cd mocks && npm i && node index.js```

3. Mocken er nå klar til å ta imot meldinger fra Integrasjonspunktet.

Meldinger som mocken har mottat kan ses på [http://localhost:8001](http://localhost:8001):

#### Kjøre node tester
1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.
2. Naviger til tester ```cd move-mocks/tests/next-move```
3. Kjør test: ```node NextMove.js```

#### jMeter

MoveMocks inneholder også jMeter tester. Disse kan brukes til ytelses testing, og for å teste om alt er satt opp og fungerer.
 
1. Åpne en av testene i ```/jMeter ```
2. I test oppsettet i menyen til venstre, gå til ```IP Stress test/Test Oppsett/Sett test variabler```, og angi IP og port til ditt Integrasjonspunkt.
3. Kjør testen.

Dersom alt er satt opp korrekt, vil meldingene gå igjennom, og du vil få et tall på hvor lang tid det tok i terminalen i jMeter. 

