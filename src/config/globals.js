'use strict'
require('dotenv').config();
module.exports = {
    "authorization" : process.env.AUTH_TOKEN,
    "secret" : process.env.SECRET,
    "invalid_token": "Failed to authenticate token.",
    "missing_token": "Unauthorized Access, token missing.",
    "email_exists" : "User with this email id already exists",
    "general_exception" : "General Exception",
    "auth_header_missing": "Unauthorized Access",
    "invalid_email_password" : "Invalid Email-id or Password",
    "employee_id_exists" : "Employee with this employee id and organization name already exists.",
    "sync_database" : false
}
