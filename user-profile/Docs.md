# User Profile Service Documentation

## Introduction

The User Profile service is responsible for managing user profiles in the Adventurgram application. It provides endpoints for creating, updating, and retrieving user profiles.

## Endpoints

### Create User Profile

- **Endpoint:** `/api/profiles`
- **Method:** POST
- **Description:** Creates a new user profile.
- **Requirements:** A token either in the form of a cookie or auth header.
- **Request Body:**
  ```json
  {
    "username": "string",
    "userId": "string",
    "profilePic": "string",
    "bio": "string",
    "location": "string",
    "followers": [""],
    "following": [""]
  }
  ```
- **Response:**
  - **Status Code:** 201 (Created)
  - **Body:**
    ```json
    {
      "id": "string",
      "username": "string",
      "userId": "string",
      "profilePic": "string",
      "bio": "string",
      "location": "string",
      "followers": [""],
      "following": [""]
    }
    ```

- **Mock Request:**
- **Endpoint:** `/api/profiles`
- **Method:** POST
- **Requirements:** A token either in the form of a cookie or auth header.
- **Headers:** 
    Content-type: application/json
- **Request Body:**
  ```json
    {
    "userId": "user1",
    "username": "testuser",
    "bio": "This is a test user.",
    "profilePic": "https://www.defaultimg.com",
    "location": "Test Location",
    "followers": ["user2", "user3"],
    "following": ["user4", "user5"]
    }
  ```

### Update User Profile

- **Endpoint:** `/api/profiles/{id}`
- **Method:** PUT
- **Description:** Updates an existing user profile.
- **Requirements:** A token either in the form of a cookie or auth header.
- **Request Body:**
  ```json
  {
    "username": "string",
    "userId": "string",
    "profilePic": "string",
    "bio": "string",
    "location": "string",
    "followers": [""],
    "following": [""]
  }
  ```
- **Response:**
  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    {
      "id": "string",
      "username": "string",
      "userId": "string",
      "profilePic": "string",
      "bio": "string",
      "location": "string",
      "followers": [""],
      "following": [""]
    }
    ```

- **Mock Request:**
- **Endpoint:** `/api/profiles/{id}`
- **Method:** PUT
- **Requirements:** A token either in the form of a cookie or auth header.
- **Headers:** 
    Content-type: application/json
- **Request Body:**
  ```json
    {
    "userId": "updateduser1",
    "username": "updatedtestuser",
    "bio": "This is a test user.",
    "profilePic": "https://www.defaultimg.com",
    "location": "Test Location",
    "followers": ["user2", "user3"],
    "following": ["user4", "user5"]
    }
  ```

### Get User Profile

- **Endpoint:** `/api/profiles/{id}`
- **Method:** GET
- **Description:** Retrieves a user profile by ID.
- **Response:**
  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    {
      "id": "string",
      "username": "string",
      "userId": "string",
      "profilePic": "string",
      "bio": "string",
      "location": "string",
      "followers": [""],
      "following": [""]
    }
    ```

## Error Handling

- **Status Code:** 400 (Bad Request)
  - **Body:**
    ```json
    {
      "errors": [{ "message": "string", "field": "string | null" }]
    }
    ```
  - **Model:** `BadRequestException`
    - **Properties:**
      - `message` (string): The error message.
  - **Model:** `RequestValidationException`
    - **Properties:**
      - `message` (string): The error message.
- **Status Code:** 404 (Not Found)
  - **Body:**
    ```json
    {
      "errors": [{ "message": "string", "field": "string | null" }]
    }
    ```
  - **Model:** `NotFoundException`
    - **Properties:**
      - `message` (string): The error message.
- **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "errors": [{ "message": "string", "field": "string | null" }]
    }
    ```
  - **Model:** `NotFoundException`
    - **Properties:**
      - `message` (string): The error message.


## Events
Events are handled by Apache Kafka. When a new user registers for the app, the auth service will publish a new `user-registered` event. This service has to listen for these events, so it can know about new users and provide them with profile creation and update services.
Then when a user updates their profile, this service will publish a `profile-updated` event, to let other services know about the new update relevant to them.

### Publishers
- **Name:** UserProfileUpdatedProducer
- **Description:** Responsible for producing events related to the updates made to profiles. On each update there will be an event sent, to be consumed by other services such as the notification service.
- **Properties:**
    - **producer:** An IProducer responsible for carrying out the produce logic.
    - **Name:** The producer name.
- **Methods:**
    - **ProduceAsync:** Receives a message in the form of a string (should be JSON) and produces a new event.

### Consumers
- **Name:** UserRegisteredConsumer
- **Description:** Responsible for consuming user created events. When a new user is created, the consumer will take the user's id and username, and create a new user in the service's DB.
- **Properties:**
    - **_userProfileService:** Responsible for saving the newly created user.
    - **_userProfileFactory:** Responsible for initializing a new user with empty fields apart from the given ID and username.
- **Methods:**
    - **Handle:** Receives the message context and a UserRegistered message in the form of a JSON string. Parses the message and creates a new user to be saved to the database.
