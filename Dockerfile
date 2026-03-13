FROM eclipse-temurin:17-jdk
COPY target/*.jar app.jar
EXPOSE 8081
CMD ["java","-jar","app.jar"]
