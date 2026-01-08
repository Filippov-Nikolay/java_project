# Online Diary (Course Project)

Online Diary is a web system for managing subjects, schedules, homework, submissions, and assessments.

## Features
- Authentication with JWT and role-based access
- User management and scheduling
- Homework, submissions, and assessments
- Email-based password recovery
- Notifications and theme toggle in the UI

## Tech Stack
Backend: Java 17, Spring Boot 3, Spring MVC, Spring Data JPA, Hibernate, Oracle JDBC, Spring Security, JWT, Spring Mail, Springdoc OpenAPI.
Frontend: Next.js (App Router), React, Redux Toolkit, SCSS Modules.
Docs: Doxygen.

## Repository Structure
- online-diary/ : backend (Spring Boot)
- online-diary/frontend/ : frontend (Next.js)
- docs-src/ : documentation sources for Doxygen
- docs/ : generated documentation site (GitHub Pages)

## Local Setup
### Backend
1. Configure DB in `online-diary/src/main/resources/application-dev.properties`.
2. Configure SMTP in `online-diary/src/main/resources/application-dev.yml`.
3. Run:
```bash
cd online-diary
mvn spring-boot:run
```

### Frontend
```bash
cd online-diary/frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

## Production Build
Backend:
```bash
cd online-diary
mvn clean package
java -jar target/online-diary-0.0.1-SNAPSHOT.jar
```
Frontend:
```bash
cd online-diary/frontend
npm run build
npm start
```

## Documentation (Doxygen)
Generate the documentation site:
```bash
doxygen Doxyfile
```
This outputs HTML to `docs/`.

### Publish with GitHub Pages
1. Commit the generated `docs/` folder.
2. In GitHub repository settings, enable Pages from the `main` branch and `/docs` folder.
3. The site will be available at:
`https://<github-user>.github.io/<repo>/index.html`

## Documentation Links
- Main documentation page: `https://<github-user>.github.io/<repo>/index.html`
