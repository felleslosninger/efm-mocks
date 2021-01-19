#!/bin/bash
#Pipeline/integration tests for efm-mocks to setup the mocks and integrasjonspunkt to send messages to the mock. 

#Overriding .env file to avoid DPI port (default 8080) collision.
writeFile file: '.env', text: 'COMPOSE_PROJECT_NAME=movemocks\nDPI_PORT=8085\nMOCK_PORT=8001\nWIREMOCK_PORT=8090\nSA_MOCK_PORT=8002\nDPI_HOST=dpimock\nMOCK_HOST=mocks\nIP_PORT=9094\nIP_URL=http://ip:9093'
archiveArtifacts '.env'
#start mock services
docker-compose up -d --build --force-recreate
docker network ls
sleep 10s


#start sending integrasjonspunkt
docker pull difimove2/integrasjonspunkt:development
docker run -d --name sending_integrasjonspunkt --net source_default -p 9093:9093 -e SPRING_PROFILES_ACTIVE=mock -eDIFI_MOVE_SERVICEREGISTRYENDPOINT=http://wiremock:8090 -eDIFI_MOVE_NOARKSYSTEM_ENDPOINTURL=http://sa-mock:8002/p360 -eDIFI_MOVE_DPI_ENDPOINT=http://dpimock:8080/as4 -eDIFI_MOVE_DPV_ENDPOINTURL=http://mocks:8001/dpv/ -eDIFI_MOVE_FIKS_UT_ENDPOINTURL=http://mocks:8001/dpf -eDIFI_MOVE_FIKS_INN_BASEURL=http://mocks:8001/svarinn -eDIFI_MOVE_NEXTMOVE_SERVICEBUS_BASEURL=mocks:8001/dpe -eDIFI_MOVE_DPO_STREAMINGSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasicStreamed.svc?wsdl -eDIFI_MOVE_DPO_BROKERSERVICEURL=http://mocks:8001/dpo/ServiceEngineExternal/BrokerServiceExternalBasic.svc?wsdl difimove2/integrasjonspunkt:development
              

#Run nextmove tests
cd tests/next-move && npm install && node NextMove.js


#Remove and shut down
docker rm sending_integrasjonspunkt --force
docker-compose down