# EXP 3 JWT Authentication

A secure authentication system using JSON Web Tokens (JWT) for user login and session management.

## Features

- User registration with password hashing using bcrypt
- Login endpoint that issues short-lived access tokens and long-lived refresh tokens
- Token refresh endpoint for session management
- Logout endpoint to revoke refresh tokens
- Protected profile route using access token verification

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and provide secrets:

```bash
copy .env.example .env
```

3. Start the server:

```bash
npm run dev
```

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/token`
- `POST /auth/logout`
- `GET /auth/profile`

## Notes

This implementation uses an in-memory store for users and refresh tokens. For production, use a persistent database and secure storage for token revocation.
