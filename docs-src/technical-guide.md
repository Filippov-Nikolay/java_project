@page technical_guide Technical Guide

# Technical Guide

## Architecture
- Web client (Next.js) communicates with a REST API (Spring Boot).
- Authentication uses JWT tokens stored in local storage and cookies.
- Business logic lives in services, persistence in repositories.

## Backend stack
- Java 17, Spring Boot 3
- Spring MVC, Spring Data JPA, Hibernate
- Oracle JDBC driver (default dev profile)
- Spring Security with JWT
- Spring Mail for SMTP
- Springdoc OpenAPI for API docs

## Frontend stack
- Next.js (App Router)
- React, Redux Toolkit
- SCSS Modules
- UI modules grouped by features, entities, shared, widgets

## Key flows
- Auth: login, token issuance, token validation by filter.
- Password recovery: token creation, email send, reset endpoint.
- CRUD: subjects, schedule, submissions, assessments.

## External integrations
- Database via JDBC configuration in application-dev.properties.
- SMTP via JavaMail settings in application-dev.yml.
