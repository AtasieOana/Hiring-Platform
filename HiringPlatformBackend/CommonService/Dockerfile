# Create a jar for the project

FROM maven:3.8.4-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package

# Execute the previously created jar

FROM openjdk:17-slim

WORKDIR /usr/app

COPY --from=builder /app/target/employer-0.0.1-SNAPSHOT.jar employer-service.jar
COPY --from=builder /app/src/main/resources ./resources

EXPOSE 8080

CMD ["java", "-jar", "employer-service.jar"]
