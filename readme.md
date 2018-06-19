## MoveMocks

MoveMocks lar deg kjøre et integrasjonspunkt uten avtaler med medlingsformidlerene.
Foreløbig støttes følgende:

* DPO
* DPF
* DPV

### Oppsett

#### Wiremock

Wiremock simulerer Service Registry, og er nødvendig for at Integrasjonspunktet skal kunne slå opp addressen til mottakende meldingsformiddler.

I ```Wiremock/__files/identifier```, må det ligge ligge en config fil for organisasjonen man ønsker å sende til, og filen må inneholde nødvendig konfigurasjon for meldingsformiddleren man ønsker å bruke.

Se ```Wiremock/__files/identifier``` for eksempler på alle de støttede meldinsformiddlerene.


#### Integrasjonspunkt

Integrasjonspunktet må konfigureres til å bruke Wiremock istedenfor SR, og til å bruke mocken for de forskjellige meldingstypene.
Følgende konfigurasjon må settes opp i den gjeldende .properties filen:

##### DPI

```difi.move.dpi.endpoint=http://localhost:8001/dpi```

##### DPV

```
difi.move.dpv.username=whatever
difi.move.dpv.password=whatever
difi.move.dpv.endpointUrl=http://localhost:8001/dpv/
```

##### DPF
```
difi.move.fiks.ut.endpointUrl=http://localhost:8001/dpf
difi.move.fiks.ut.username=username
difi.move.fiks.ut.password=password
difi.move.fiks.inn.mailOnError=false
difi.move.fiks.inn.baseUrl=http://localhost:8001
```

##### DPO
```
difi.move.noarkSystem.type=p360
logging.level.no.difi.meldingsutveksling.noarkexchange.altinn=debug
logging.level.org.springframework.ws.client.MessageTracing=TRACE
logging.level.org.springframework.ws.server.MessageTracing=TRACE     
difi.move.noarkSystem.endpointURL=http://localhost:8001/noark
```

#### MoveMocks

1. MoveMocks krever node.js installert. Gå til [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for å laste ned og installere node js for ditt system.

2. ``` cd mocks && npm i && node index.js```

3. Mocken er nå klar til å ta imot meldinger fra Integrasjonspunktet.

Meldinger som mocken har mottat kan ses på:

* [DPV](http://localhost:8001/messages/dpv)
* [DPO](http://localhost:8001/messages/dpo)
* [DPF](http://localhost:8001/messages/dpf)

#### jMeter

MoveMocks inneholder også jMeter tester. Disse kan brukes til ytelses testing, og for å teste om alt er satt opp og fungerer.
 
1. Åpne en av testene i ```/jMeter ```
2. I test oppsettet i menyen til venstre, gå til ```IP Stress test/Test Oppsett/Sett test variabler```, og angi IP og port til ditt Integrasjonspunkt.
3. Kjør testen.

Dersom alt er satt opp korrekt, vil meldingene gå igjennom, og du vil få et tall på hvor lang tid det tok i terminalen i jMeter. 



