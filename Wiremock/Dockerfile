FROM openjdk:8-jre-alpine

ENV VERSION 2.23.2

RUN apk --no-cache add curl
RUN mkdir /opt/wiremock
WORKDIR /opt/wiremock
COPY ./__files /opt/wiremock/__files
COPY ./mappings /opt/wiremock/mappings
RUN curl -o wiremock.jar https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/$VERSION/wiremock-standalone-$VERSION.jar
EXPOSE 8090

ENTRYPOINT ["java","-jar","wiremock.jar","--verbose", "--global-response-templating", "--port", "8090"]
