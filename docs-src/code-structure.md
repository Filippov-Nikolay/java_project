@page code_structure Code Structure

# Code Structure

## Repository layout
- online-diary/ : Spring Boot backend
- online-diary/frontend/ : Next.js frontend
- docs-src/ : documentation sources used by Doxygen
- docs/ : generated documentation site (output)

## Backend packages
- com.nikolay.onlinediary : application entry point
- com.nikolay.onlinediary.config : Spring and OpenAPI configuration
- com.nikolay.onlinediary.domain : JPA entities and enums
- com.nikolay.onlinediary.dto : request/response DTOs
- com.nikolay.onlinediary.repository : Spring Data JPA repositories
- com.nikolay.onlinediary.service.api : service interfaces
- com.nikolay.onlinediary.service.impl : service implementations
- com.nikolay.onlinediary.web : REST controllers
- com.nikolay.onlinediary.security : JWT and security filters
- com.nikolay.onlinediary.aop : logging aspect

## Frontend structure
- src/app : Next.js routes and layouts
- src/features : feature-level UI and logic
- src/entities : domain entities and hooks
- src/shared : shared UI, utils, and configs
- src/widgets : composite UI blocks
