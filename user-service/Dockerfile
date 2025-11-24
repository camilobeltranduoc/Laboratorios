# Use OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Copy wallet directory
COPY src/main/resources/wallet ./src/main/resources/wallet

# Build the application
RUN ./mvnw clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy wallet directory
COPY --from=build /app/src/main/resources/wallet /app/wallet

# Expose port
EXPOSE 8081

# Set active profile to cloud
ENV SPRING_PROFILES_ACTIVE=cloud
ENV WALLET_LOCATION=/app/wallet

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
