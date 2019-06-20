FROM java:8-jre

ENV VERSION 2.23.2

RUN mkdir /opt/wiremock
WORKDIR /opt/wiremock
COPY ./__files /opt/wiremock/__files
COPY ./mappings /opt/wiremock/mappings
RUN curl -sSL -o wiremock.jar http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/$VERSION/wiremock-standalone-$VERSION.jar
EXPOSE 8090

ENTRYPOINT ["java","-jar","wiremock.jar","--verbose", "--global-response-templating", "--port", "8090"]
