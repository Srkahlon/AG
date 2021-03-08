## Requirements

- Node version - v10.19.0
- Postgres version - 12.6


## Installation

Use the package manager [npm] to install the dependencies.

```bash
npm install
```

## Database

The database connection is specified in the src/config/database.js file.

Changing the "sync_database" to true in the src/configs/globals.js will create the required tables.

## To Run the application

```bash
node index.js
```

## Endpoints

### Register User
- On Local - http://localhost:8080/api/register
- For Server - http://65.1.155.86:8080/api/register

#### Headers
```bash
- Content-Type - application/json
- Authorization - 5e53c09fb5b2bd665197f287 (You can specify your own auth key in .env file)
```

#### Request body

- First Name and Last Name are to be strings
- Password has validation for min 8 to max 10 letters with at least 1 Upper case, 1 lower case, one number, and 1 special character.
- Email id has basic email validation
- Employee id and Org name to be strings.

```bash
{
    "first_name": "Simran",
    "last_name" : "Kahlon",
    "email_id" : "simran@gmail.com",
    "password" : "Abcd@123",
    "employee_id" : "XYZ101",
    "organization_name" : "XYZ"
}
```
#### Response
```bash
{
    "success": 1,
    "message": "User created",
    "data": {
        "auth": true,
        "token": "xxxx"
    }
}
```

### Login User
- On Local - http://localhost:8080/api/login
- For Server - http://65.1.155.86:8080/api/login

#### Headers
```bash
- Content-Type - application/json
- Authorization - 5e53c09fb5b2bd665197f287 (You can specify your own auth key in .env file)
```

#### Request body

```bash
{
    "email_id" : "simran@gmail.com",
    "password" : "abcd@123"
}
```
#### Response
```bash
{
    "success": 1,
    "message": "Successful Login",
    "data": {
        "auth": true,
        "token": "xxxxx",
        "first_name": "Simran",
        "last_name": "Kahlon"
    }
}
```

### Get User List
- On Local - http://localhost:8080/api/getUserList
- For Server - http://65.1.155.86:8080/api/getUserList

#### Headers
```bash
- Content-Type - application/json
- Authorization - 5e53c09fb5b2bd665197f287 (You can specify your own auth key in .env file)
- x-access-token - xxxxx (Token returned on successful login/registration. Its valid for 24 hours)
```

#### Request body
- search_field is an optional field that can be any of the ones - (first_name, last_name, employee_id). Its case insensitive search with search_value at any position.
- search_value is an optional field.
- sort_field is an optional field that can be any of the ones(first_name, last_name, email_id, employee_id, organization_name). Sorting is done in ascending order.
- page - optional field that represents the page number.
- size - optional field that represents the no. of records on each page.

If none of the above fields are passed, by default the first 10 records will be returned.


```bash
    {
        "search_field": "first_name",
        "search_value" : "si",
        "sort_field": "organization_name",
        "page": 0,
        "size": 3
    }
```
#### Response
```bash
[
    {
        "first_name": "Simran",
        "last_name": "Kahlon",
        "email_id": "simran@gmail.com",
        "employee": {
            "employee_id": "XYZ101",
            "organization_name": "XYZ"
        }
    }
]
```

## Folder Structure

- The entry point of the application is the index.js file
- All other files are present in the src folder
- The config folder inside src contains configuration-related files like database.js and globals.js.
- The controllers folder contains, authController.js (contains the checkHeader and verifyToken function). The userController.js contains the register, login and getUserList functions.
- The routes are present in the src/routes/apiRoutes.js
- The User and Employee model and migration are present in the src/models and src/migrations folder subsequently.
- .env file contains environment related values.