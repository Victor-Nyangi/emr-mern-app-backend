const express = require("express");
const path = require('path');
const app = express();
const connectDB = require('./config/db');
var cors = require('cors');

const v1ServiceRoutes = require('./routes/api/service_api')
const v1MemberRoutes = require('./routes/api/member_api')
const v1DepartmentRoutes = require('./routes/api/department_api')
const v1DrugRoutes = require('./routes/api/drug_api')
const v1PatientRoutes = require('./routes/api/patient_api')
const v1BillingRoutes = require('./routes/api/billing_api')
const v1VitalRoutes = require('./routes/api/vital_api')
const v1FinancialRoutes = require('./routes/api/financial_api')
const v1AuthRoutes = require('./routes/api/auth_api')


// patient_name,
// doctor_name,
// lab_information,
// diagnosis,
// date_created


// Lab tests

// blood_tests
// microbiology
// Cytology
// Xrays
// Urine tests
// X-rays
// MRI
// CT Scan

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Init Middleware
// app.use(express.json({ extended: false }));

// parse requests of content-type - application/json
app.use(express.json());

// Serve frontend
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')))

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
//     )
//   )
// } else {
  app.get("/", (req, res) => {
      res.json({ info: "Node.js, Express, and MongoDB API" });
    });
// }

app.use('/api/v1/services', v1ServiceRoutes)
app.use('/api/v1/departments', v1DepartmentRoutes)
app.use('/api/v1/drugs', v1DrugRoutes)
app.use('/api/v1/members', v1MemberRoutes)
app.use('/api/v1/patients', v1PatientRoutes)
app.use('/api/v1/billings', v1BillingRoutes)
app.use('/api/v1/vitals', v1VitalRoutes)
app.use('/api/v1/financials', v1FinancialRoutes)
app.use('/api/v1/users', v1AuthRoutes)


const port = process.env.PORT || 5000;

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});

