FROM openjdk:8-jre-slim

ENV JAVA_OPTS="" \
    APP_DIR=/opt/dpi-mock-c2/ \
    LOG_DIR=/var/log/dpi-mock-c2 \
    APP_FILE_NAME=dpi-mock-c2.jar

RUN addgroup --system --gid 1001 java && adduser --system --uid 1001 --group java
RUN chown -R java:java /opt

ADD --chown=java:java target/dpi-mock-c2.jar ${APP_DIR}$APP_FILE_NAME

RUN mkdir $LOG_DIR && chown -R java:java $LOG_DIR && chmod -R 0775 $LOG_DIR

USER java

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar ${APP_DIR}$APP_FILE_NAME ${0} ${@}"]

