FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/${artifactId}-${version}.jar app.jar

EXPOSE ${service-port}

ENTRYPOINT ["java", "-jar", "app.jar"]
