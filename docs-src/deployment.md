@page deployment Deployment

# Deployment

## Requirements
- Java 17
- Maven 3.9+
- Node.js 18+ and npm
- Oracle DB (or H2 for local testing)
- SMTP credentials for email

## Configuration
- Database: online-diary/src/main/resources/application-dev.properties
- Mail: online-diary/src/main/resources/application-dev.yml
- Active profile: online-diary/src/main/resources/application.properties

## Build and run (backend)
```bash
cd online-diary
mvn clean package
java -jar target/online-diary-0.0.1-SNAPSHOT.jar
```

## Build and run (frontend)
```bash
cd online-diary/frontend
npm install
npm run build
npm start
```

## Production notes
- Update CORS origins in SecurityConfig.
- Use a strong JWT secret and rotate it when needed.
- Store credentials in environment variables or a secret manager.
