# Authentication and Authorization Guide

This document provides a comprehensive overview of the authentication and authorization mechanism implemented in the Viyom donation platform. The system uses Spring Security with JSON Web Tokens (JWT) for stateless authentication.

## Core Components and Key Files

The following files are the building blocks of our security implementation:

### 1. `pom.xml`
- **Purpose**: Manages all project dependencies.
- **Key Dependencies**:
  - `spring-boot-starter-security`: Core dependency for Spring Security.
  - `jjwt-api`, `jjwt-impl`, `jjwt-jackson`: For creating and parsing JWTs.
  - `lombok`: Reduces boilerplate code with annotations like `@Data` and `@Slf4j`.

### 2. `SecurityConfig.java`
- **Purpose**: Central hub for security configuration.
- **Responsibilities**:
  - **Filter Chain**: Defines the main security filter chain that intercepts all incoming requests.
  - **CORS Configuration**: Configures Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
  - **Public Endpoints**: Specifies which URL paths are public (e.g., `/api/auth/**`) and which require authentication.
  - **Session Management**: Configured to be `STATELESS` since we are using JWTs.
  - **Bean Definitions**: Exposes critical beans like `PasswordEncoder`, `AuthenticationManager`, and the `JwtAuthenticationFilter`.

### 3. `JwtAuthenticationFilter.java`
- **Purpose**: A custom filter that executes once per request to validate the JWT.
- **Responsibilities**:
  - **Token Extraction**: Parses the `Authorization` header to extract the JWT.
  - **Token Validation**: Uses `JwtService` to validate the token's signature and expiration.
  - **Security Context**: If the token is valid, it sets the user's authentication details in the `SecurityContextHolder`, making the user's security principal available throughout the request.

### 4. `JwtService.java`
- **Purpose**: A utility service dedicated to JWT operations.
- **Responsibilities**:
  - **Token Generation**: Creates a signed JWT upon successful user login, including user details like email and role as claims.
  - **Token Parsing**: Extracts claims (e.g., username, role) from a given token.
  - **Validation**: Verifies the token's integrity and checks if it has expired.

### 5. `UserDetailsServiceImpl.java`
- **Purpose**: Implements Spring Security's `UserDetailsService` interface.
- **Responsibilities**:
  - **User Loading**: Its primary method, `loadUserByUsername`, is called by the `AuthenticationManager` during the authentication process. It fetches the user from the database using the `AuthUserRepository` and converts the `AuthUser` entity into a `UserDetails` object that Spring Security understands.

### 6. `AuthService.java`
- **Purpose**: Contains the core business logic for registration and login.
- **Responsibilities**:
  - **Registration**: Handles new user registration, including validating input, checking for existing users, encoding the password, and saving the new `AuthUser` to the database.
  - **Login**: Manages the login process by using the `AuthenticationManager` to validate credentials and, upon success, generating a JWT using `JwtService`.

### 7. `AuthController.java`
- **Purpose**: The REST controller that exposes the authentication endpoints.
- **Responsibilities**:
  - **Endpoints**: Provides the public `/api/auth/register` and `/api/auth/login` endpoints.
  - **Request Handling**: Delegates the actual logic to `AuthService`.

### 8. `AuthUser.java` (Entity)
- **Purpose**: The JPA entity that maps to the `auth_users` table in the database.
- **Fields**: `id`, `email`, `password`, `role`, `enabled`.

### 9. DTOs (`RegisterRequest.java`, `LoginRequest.java`, `JwtResponse.java`)
- **Purpose**: Data Transfer Objects used to carry data between the client and the server for authentication operations.

### 10. Exception Handling (`GlobalExceptionHandler.java`, `ErrorResponse.java`)
- **Purpose**: Provides centralized and consistent exception handling for security-related and other errors, returning structured JSON error responses.

## Authentication Flow (Login)

1.  **Request**: A client sends a `POST` request to `/api/auth/login` with a JSON body containing the user's email and password.
2.  **Controller**: `AuthController` receives the request and calls `AuthService.login()`.
3.  **Authentication**: `AuthService` uses the `AuthenticationManager` to authenticate the request. The `AuthenticationManager` in turn uses `UserDetailsServiceImpl` to load the user from the database and the `PasswordEncoder` to verify the password.
4.  **JWT Generation**: If authentication is successful, `AuthService` calls `JwtService.generateToken()` to create a JWT.
5.  **Response**: `AuthService` returns a `JwtResponse` object containing the token to the client.

## Subsequent Authenticated Requests

1.  **Header**: The client includes the JWT in the `Authorization` header of all subsequent requests to protected endpoints (e.g., `Authorization: Bearer <token>`).
2.  **Filter**: `JwtAuthenticationFilter` intercepts the request, extracts the token, and uses `JwtService` to validate it.
3.  **Context**: If the token is valid, the filter creates an `Authentication` object and sets it in the `SecurityContextHolder`.
4.  **Access**: The request is allowed to proceed to the requested controller, and the application can access the authenticated user's details via the `SecurityContext`.
