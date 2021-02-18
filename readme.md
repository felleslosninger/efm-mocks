## MoveMocks

MoveMocks lar deg simulere de forskjellige meldingsformidlertjenestene.

![alt text](images/Mock.jpg "Container diagram")


### Forutsetninger

* Docker
* Integrasjonspunkt
* Java JDK/OpenJDK installert (JAVA_HOME må være satt)


### Oppstart

1. ``` git clone https://github.com/difi/move-mocks.git ```
2. Pass på at ingenting kjører på følgende porter: 9093, 8001, 8002 og 8080, eller spesifiser porter i .env filen.
3. Kjør ``` docker-compose up ``` i roten av prosjektet. 

Du har nå følgende applikasjoner kjørende:

* localhost:8090: Wiremock - Simulerer SR.
* localhost:8080: DPI mock.
* localhost:8001: DPO, DPV, DPF, og DPE mock.
* localhost:8002: Sak/arkivsystem mock.
* localhost:9094: Mottagende Integrasjonspunkt.

På localhost:8001 finner du et lite gui der du kan se meldinger som har blitt sendt vellykket.


### Oppsett Integrasjonspunkt

Start integrasjonspunktet med *mock* profil. Eksempel på oppstartkommando: ```java -Dspring.profiles.active=mock -jar integrasjonspunkt[versjon].jar```
Ved behov for overstyringer av properties kan dette gjøres i ```integrasjonspunkt-local.properties```. Propperties verdiene integrasjonspunktet kjører med i *mock* profil finner du [her](https://github.com/difi/move-integrasjonspunkt/blob/development/integrasjonspunkt/src/main/resources/config/application-mock.properties)

[*Generell informasjon om hvordan sette opp et integrasjonspunkt*](https://difi.github.io/felleslosninger/eformidling_download_ip.html)

#### Sende meldinger

Mocken er satt opp til å motta meldinger for følgende org nr og prosesser:

| Tjeneste(/Meldingstype)| Mottaker    | Prosess                                                     | Dokumenttype                                 |
|------------------------|-------------|-------------------------------------------------------------|----------------------------------------------|
| DPI                    | 06068700602 | urn:no:difi:profile:digitalpost:info:ver1.0                 | urn:no:difi:digitalpost:xsd:digital::digital |
| DPI Print              | 06068700602 | urn:no:difi:profile:digitalpost:vedtak:ver1.0               | urn:no:difi:digitalpost:xsd:fysisk::print    |
| DPI Digital DPV        | 10068700602 | urn:no:difi:profile:digitalpost:info:ver1.0	               | urn:no:difi:digitalpost:xsd:digital::digital_dpv |
| DPE Journal            | 810074582   | urn:no:difi:profile:einnsyn:journalpost:ver1.0              | urn:no:difi:einnsyn:xsd::publisering         |
| DPE Innsynsbegjæring   | 910075918   | urn:no:difi:profile:einnsyn:innsynskrav:ver1.0              | urn:no:difi:einnsyn:xsd::innsynskrav         |
| DPE Møte               | 810074582   | urn:no:difi:profile:einnsyn:meeting:ver1.0                  | urn:no:difi:einnsyn:xsd::publisering         |
| DPO                    | 810074582   | urn:no:difi:profile:arkivmelding:administrasjon:ver1.0      | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPV                    | 910075918   | urn:no:difi:profile:arkivmelding:helseSosialOgOmsorg:ver1.0 | urn:no:difi:arkivmelding:xsd::arkivmelding   |
| DPF                    | 910075918   | urn:no:difi:profile:arkivmelding:planByggOgGeodata:ver1.0   | urn:no:difi:arkivmelding:xsd::arkivmelding   |

Meldinger som mocken har mottatt kan ses på [http://localhost:8001](http://localhost:8001)


#### Sende meldinger

MoveMocks inneholder også testscript for å sende de forskjellige meldingstypene.

1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.
2. ```cd move-mocks/tests npm install``` 
3. Naviger til tester ```cd move-mocks/tests/next-move```
4. Kjør test: ```node NextMove.js```
5. For å sende spesifikke meldingstyper kan du kjøre ``` node NextMove.js dpi dpiprint dpe dpf dpv dpo ```.
6. Kjør : ```node NextMove.js -h``` for å se alle valg.

#### Ende til ende teste DPO og DPE meldinger

DPO og DPE meldinger vil bli sendt hele veien til Sak/Arkiv mocken som kjører på http://localhost:8002.
Der kan du også sende DPO og DPE meldinger tilbake til ditt integrasjonspunkt for å teste mottak.

Dette forutsetter at ditt integrasjonspunkt kjører med org nummeret som er angitt i eksempel properties filen i dette repoet (integrasjonspunkt-local.properties).

#### jMeter

MoveMocks inneholder også jMeter tester. Disse kan brukes til ytelses testing, og for å teste om alt er satt opp og fungerer.
 
1. Åpne en av testene i ```/jMeter ```
2. I test oppsettet i menyen til venstre, gå til ```IP Stress test/Test Oppsett/Sett test variabler```, og angi IP og port til ditt Integrasjonspunkt.
3. Kjør testen.

Dersom alt er satt opp korrekt, vil meldingene gå igjennom, og du vil få et tall på hvor lang tid det tok i terminalen i jMeter. 

#### Docker tips

Kommando som kan brukes til å bygge prosjektet etter oppdatering ```docker-compose up --build --force-recreate```. Kjøres i roten av prosjektet.
