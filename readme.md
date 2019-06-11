## MoveMocks

MoveMocks lar deg simulere de forskjellige meldingsformidlertjenestene.

![alt text](images/MockContainers.png "Container diagram")


### Forutsetninger

* Docker
* Integrasjonspunkt
* Java JDK/OpenJDK installert (JAVA_HOME må være satt)


### Oppstart

Dersom du skal kjøre DPI mocken må du utføre følgende skritt før ```docker-compose up```:

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


### Oppsett Integrasjonspunkt

1. Kopier ```move-mocks/dpimock/src/main/resources/mock.jks```, ```move-mocks/dpimock/src/main/resources/mock-truststore.jks```, ```integrasjonspunkt-local.properties``` og ```move-mocks/kontaktinfo-client.pem``` working directory for integrasjonspunktet.
2. Start integrasjonspunktet med *dev* profil.  

[*Generell informasjon om hvordan sette opp et integrasjonspunkt*](https://difi.github.io/felleslosninger/eformidling_download_ip.html)

#### Sende meldinger

Mocken er satt opp til å motta meldinger for følgende org nr og prosesser:

| Meldingstype         | Mottaker    | Prosess                                                     | Dokumenttype                                 |
|----------------------|-------------|-------------------------------------------------------------|----------------------------------------------|
| DPI                  | 06068700602 | urn:no:difi:profile:digitalpost:info:ver1.0                 | urn:no:difi:digitalpost:xsd:digital::digital |
| DPI Print            | 06068700602 | urn:no:difi:profile:digitalpost:vedtak:ver1.0               | urn:no:difi:digitalpost:xsd:fysisk::print    |
| DPE Journal          | 910076787   | urn:no:difi:profile:einnsyn:journalpost:ver1.0              | urn:no:difi:einnsyn:xsd::publisering         |
| DPE Innsynsbegjæring | 910076787   | urn:no:difi:profile:einnsyn:innsynskrav:ver1.0              | urn:no:difi:einnsyn:xsd::innsynskrav         |
| DPE Møte             | 910076787   | urn:no:difi:profile:einnsyn:meeting:ver1.0                  | urn:no:difi:einnsyn:xsd::publisering         |
| DPO                  | 991825827   | urn:no:difi:profile:arkivmelding:administrasjon:ver1.0      | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPV                  | 991825827   | urn:no:difi:profile:arkivmelding:helseSosialOgOmsorg:ver1.0 | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPF                  | 991825827   | urn:no:difi:profile:arkivmelding:planByggOgGeodata:ver1.0   | urn:no:difi:arkivmelding:xsd::arkivmelding   |

Meldinger som mocken har mottatt kan ses på [http://localhost:8001](http://localhost:8001)


#### Kjøre node tester
1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.
2. Naviger til tester ```cd move-mocks/tests/next-move```
3. Kjør test: ```node NextMove.js```

For å sende spesifikke meldingstyper kan du kjøre ``` node NextMove.js dpi dpiprint dpe dpf dpv dpo ```.

#### jMeter

MoveMocks inneholder også jMeter tester. Disse kan brukes til ytelses testing, og for å teste om alt er satt opp og fungerer.
 
1. Åpne en av testene i ```/jMeter ```
2. I test oppsettet i menyen til venstre, gå til ```IP Stress test/Test Oppsett/Sett test variabler```, og angi IP og port til ditt Integrasjonspunkt.
3. Kjør testen.

Dersom alt er satt opp korrekt, vil meldingene gå igjennom, og du vil få et tall på hvor lang tid det tok i terminalen i jMeter. 

#### Docker tips

Kommando som kan brukes til å bygge prosjektet etter oppdatering ```docker-compose up --build --force-recreate```. Kjøres i roten av prosjektet.