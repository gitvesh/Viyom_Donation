# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache this layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the JAR package (skipping tests for speed)
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal runtime image
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/viyom-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Run the application with optimized memory settings
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
