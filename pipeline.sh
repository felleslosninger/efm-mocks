#!/bin/bash
#Pipeline/integration tests for efm-mocks to setup the mocks and integrasjonspunkt to send messages to the mock. 

#start mock services
docker-compose up -d --build --force-recreate
sleep 10s


#start sending integrasjonspunkt
docker pull difimove2/integrasjonspunkt:development
docker run -d --name sending_integrasjonspunkt --net source_default -p 9093:9093 -e SPRING_PROFILES_ACTIVE=mock -eDIFI_MOVE_SERVICEREGISTRYENDPOINT=http://wiremock:8090 -eDIFI_MOVE_NOARKSYSTEM_ENDPOINTURL=http://sa-mock:8002/p360 -eDIFI_MOVE_DPI_ENDPOINT=http://dpimock:8080/as4 -eDIFI_MOVE_DPV_ENDPOINTURL=http://mocks:8001/dpv/ -eDIFI_MOVE_FIKS_UT_ENDPOINTURL=http://mocks:8001/dpf -eDIFI_MOVE_FIKS_INN_BASEURL=http://mocks:8001/svarinn -eDIFI_MOVE_NEXTMOVE_SERVICEBUS_BASEURL=mocks:8001/dpe -eDIFI_MOVE_DPO_STREAMINGSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl -eDIFI_MOVE_DPO_BROKERSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc?wsdl difimove2/integrasjonspunkt:development
sleep 120s
curl http://localhost:9093/manage/health              

#Run nextmove tests
cd tests/next-move && npm install && node NextMove.js webhookUrl host.docker.internal:3001/incoming


#Remove and shut down
docker rm sending_integrasjonspunkt --force
cd ../..
docker-compose down
