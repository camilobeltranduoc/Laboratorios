# Use Maven with OpenJDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml
COPY pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy wallet directory
COPY --from=build /app/src/main/resources/wallet /app/wallet

# Expose port
EXPOSE 8082

# Set active profile to cloud
ENV SPRING_PROFILES_ACTIVE=cloud
ENV WALLET_LOCATION=/app/wallet

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
