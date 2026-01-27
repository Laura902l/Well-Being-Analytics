# Mental Health Survey Application


## Project Description

This project is a **full-stack web application** for collecting and managing mental health surveys
(burnout, stress, work-life balance).

It includes:

* **Backend**: REST API built with Node.js, Express, MongoDB
* **Frontend**: Angular single-page application
* **Authentication**: JWT-based authentication with role-based authorization
* **Testing**: Integration and E2E testing with network interception and error simulation

The project was developed with a strong focus on **quality assurance, reliability, and test coverage**.



## Technology Stack

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs

### Frontend

* Angular
* HttpClient
* Playwright (E2E testing)

### Testing

* Jest
* Supertest
* Playwright
* Jest mocks (models, middleware)
* Network interception (Playwright)



## Project Structure

### Backend Structure

```
backend/
├── app.js
├── server.js
├── models/
│   ├── User.js
│   └── Survey.js
├── routes/
│   ├── auth.routes.js
│   └── survey.routes.js
├── middleware/
│   ├── auth.middleware.js
│   └── admin.middleware.js
├── tests/
│   └── integration/
│       ├── auth.test.js
│       ├── survey.test.js
│       ├── auth.middleware.test.js
│       └── admin.middleware.test.js
├── package.json
└── jest.config.js
```



### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── survey/
│   │   │   └── surveys-list/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── survey.service.ts
│   │   ├── guards/
│   │   └── app.module.ts
│   └── assets/
├── e2e/
│   ├── smoke.spec.ts
│   └── survey.spec.ts
├── playwright.config.ts
└── package.json
```



## Authentication & Authorization

### Authentication

* Implemented using **JWT tokens**
* Token is issued on successful login
* Token includes:

  * user id
  * username
  * role

### Authorization

* `auth.middleware` verifies JWT and attaches `req.user`
* `admin.middleware` allows access **only for admin users**
* Protected routes:

  * saving surveys
  * viewing own surveys
  * admin access to all surveys



## Database Models

### User Model

* username (unique)
* fullname
* hashed password
* role (`user` / `admin`)

### Survey Model

* userId (reference to User)
* username
* surveyId (burnout / stress / work-life)
* data (survey answers)
* timestamps

A **compound unique index** ensures that each user can submit only one survey per survey type.



## Testing Strategy

### Integration Testing (Backend)

**Tools**: Jest + Supertest

Covered scenarios:

* User registration and login
* Invalid credentials
* JWT authentication errors
* Forbidden access (403)
* Admin-only route protection
* Database failures (500 errors)
* Survey upsert logic

All database interactions are **mocked**, ensuring:

* no real database usage
* deterministic and fast tests



### End-to-End Testing (Frontend)

**Tool**: Playwright

Covered scenarios:

* Application loads correctly (smoke test)
* Long network loading:

  * API requests are delayed
  * Survey results are not shown immediately
* Race condition handling:

  * Double click on “Save”
  * Only **one network request** is sent

Network requests are intercepted using `page.route`, ensuring:

* full isolation from real backend
* stable and repeatable tests



## Race Conditions & Long Loading

### Race Conditions

* Backend uses `findOneAndUpdate` with `upsert`
* Prevents duplicate survey entries
* Verified via E2E test simulating double submit

### Long Loading

* Delayed API responses simulated in Playwright
* UI behavior verified during slow network conditions



## Code Coverage

Code coverage is collected using **Jest**.

### Achieved Coverage

| Metric    | Coverage |
|  | -- |
| Lines     | 85%+     |
| Branches  | 86%+     |
| Functions | 87%+     |

✔️ All logical services exceed the **80% requirement**



## ▶How to Run the Project

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
ng serve
```



## ▶How to Run Tests

### Backend Tests

```bash
cd backend
npx jest --coverage
```

### Frontend E2E Tests

```bash
cd frontend
npx playwright install
npx playwright test
```