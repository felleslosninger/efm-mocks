#!/bin/bash
#Pipeline/integration tests for efm-mocks to setup the mocks and integrasjonspunkt to send messages to the mock. 

#start mock services
docker-compose up -d --build --force-recreate
docker network ls
sleep 10s


#start sending integrasjonspunkt
docker pull difimove2/integrasjonspunkt:development
docker run -d --name sending_integrasjonspunkt --net source_default -p 9093:9093 -e SPRING_PROFILES_ACTIVE=mock -e DIFI_MOVE_SERVICEREGISTRYENDPOINT=http://wiremock:8090 -e DIFI_MOVE_NOARKSYSTEM_ENDPOINTURL=http://sa-mock:8002/p360 -e DIFI_MOVE_DPI_ENDPOINT=http://dpimock:8080/as4 -e DIFI_MOVE_DPV_ENDPOINTURL=http://mocks:8001/dpv/ -e DIFI_MOVE_FIKS_UT_ENDPOINTURL=http://mocks:8001/dpf -e DIFI_MOVE_FIKS_INN_BASEURL=http://mocks:8001/svarinn -e DIFI_MOVE_NEXTMOVE_SERVICEBUS_BASEURL=mocks:8001/dpe -e DIFI_MOVE_DPO_STREAMINGSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl -e DIFI_MOVE_DPO_BROKERSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc?wsdl --env-file ./.env difimove2/integrasjonspunkt:development
              

#Run nextmove tests
cd tests/next-move && npm install && node NextMove.js


#Remove and shut down
docker rm sending_integrasjonspunkt --force
docker-compose down