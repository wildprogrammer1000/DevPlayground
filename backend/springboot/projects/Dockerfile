# 1. Build stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -T 1C

# 2. Runtime stage
FROM openjdk:17-slim
COPY --from=build /app/target/*.war app.war
ENTRYPOINT ["java", "-jar", "/app.war"]
