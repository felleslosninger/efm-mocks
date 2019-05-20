## MoveMocks

MoveMocks lar deg simulere de forskjellige meldingsformidlertjenestene.

![alt text](images/MockContainers.png "Container diagram")


### Forutsetninger

* Docker
* Kjørende integrasjonspunkt


### Oppstart

Dersom du skal kjøre DPI mocken må du utføre følgende skritt før docker-compose up:

1. ``` git clone https://github.com/difi/move-mocks.git ```
2. Bygg dpimock prosjektet: ``` cd move-mocks/dpimock && ./mvnw install dockerfile:build ```
5. Pass på at ingenting kjører på følgende porter: 9093, 8001, 8002 og 8080.
6. Kjør ``` docker-compose up ``` i roten av prosjektet. 

Du har nå følgende applikasjoner kjørende:

* localhost:8090: Wiremock - Simulerer SR.
* localhost:8080: DPI mock.
* localhost:8001: DPO, DPV, DPF, og DPE mock.
* localhost:8002: Sak/arkivsystem mock.

På localhost:8001 finner du et lite gui der du kan se meldinger som har blitt sendt vellykket.


### Oppsett


#### Integrasjonspunkt

1. Kopier filen integrasjonspunkt-local.properties inn til der du kjører integrasjonspunktet.
2. Koper dpimock/src/main/resources/altinn.jks og dpimock/src/main/resources/demo.jks inn til der du kjører integrasjonspunktet.
3. Start integrasjonspunktet. 

#### Sende meldinger

Mocken er satt opp til å motta meldinger for følgende org nr og prosesser:

| Meldingstype | Mottaker    | Prosess              |
|--------------|-------------|----------------------|
| DPI          | 06068700602 | kulturIdrettOgFritid |
| DPE          |             |                      |
| DPV          | 991825827   | helseSosialOgOmsorg  |
| DPF          | 991825827   | planByggOgGeodata    |
| DPO          | 991825827   | administrasjon       |

#### Kjør mocks uten docker

1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.

2. ``` cd mocks && npm i && node index.js```

3. Mocken er nå klar til å ta imot meldinger fra Integrasjonspunktet.

Meldinger som mocken har mottat kan ses på [http://localhost:8001](http://localhost:8001):


#### jMeter

MoveMocks inneholder også jMeter tester. Disse kan brukes til ytelses testing, og for å teste om alt er satt opp og fungerer.
 
1. Åpne en av testene i ```/jMeter ```
2. I test oppsettet i menyen til venstre, gå til ```IP Stress test/Test Oppsett/Sett test variabler```, og angi IP og port til ditt Integrasjonspunkt.
3. Kjør testen.

Dersom alt er satt opp korrekt, vil meldingene gå igjennom, og du vil få et tall på hvor lang tid det tok i terminalen i jMeter. 

