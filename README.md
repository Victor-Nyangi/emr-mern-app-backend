# emr-mern-app-backend

## Node Js backend for a electronic management records MERN app. The backend acting as an API for a React frontend

* [Send message (GET)](http://localhost:5000/api/v1/sms/deliveryreports)
* [Receive message (POST)](http://localhost:5000/api/v1/sms/receivemessage)
* [Check deliver status (POST)](http://localhost:5000/api/v1/sms/deliveryreports)


## Authentication
Attribute-Based Access Control (ABAC) system for your EMR application. Here's what has been created:

### Implementation

Role Model - Defines roles with detailed permissions including attributes like department, patient status, visit type, data sensitivity, and time restrictions
Updated User Model - Now includes role, department, employee ID, and other fields
Authorization Service - Core ABAC logic with context-aware permission checking
Authorization Middleware - Route-level protection with predefined middleware for common operations
Permission Data - Comprehensive role definitions for admin, doctor, nurse, receptionist, billing specialist, and lab technician
Seeder Script - Creates roles and test users with different permission levels

### Test Users Created

Admin: admin@emr.com / admin123 (full access)
Doctor: doctor@emr.com / doctor123 (patient care, department restricted)
Nurse: nurse@emr.com / nurse123 (patient care, time restricted)
Receptionist: receptionist@emr.com / receptionist123 (limited access)
Billing: billing@emr.com / billing123 (billing access)
Lab Tech: lab@emr.com / lab123 (lab access)