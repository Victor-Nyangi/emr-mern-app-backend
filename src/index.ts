import { createApp } from "./app";

import v1ServiceRoutes from "./routes/api/service-api";
import v1DepartmentRoutes from "./routes/api/department-api";
import v1BillingRoutes from "./routes/api/billing-api";
import v1AuthRoutes from "./routes/api/user-api";
import v1VitalRoutes from "./routes/api/vital-api";
// import v1MemberRoutes from "./routes/api/member_api";
// import v1DrugRoutes from "./routes/api/drug_api";
// import v1PatientRoutes from "./routes/api/patient_api";
// import v1FinancialRoutes from "./routes/api/financial_api";
// import v1messageRoutes from "./routes/api/message_api";
import homeRoutes from "./routes/home";


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
const app = createApp();

app.use("/api/v1", homeRoutes);
app.use('/api/v1/services', v1ServiceRoutes)
app.use('/api/v1/departments', v1DepartmentRoutes)
app.use('/api/v1/billings', v1BillingRoutes)
app.use('/api/v1/vitals', v1VitalRoutes)
app.use('/api/v1/users', v1AuthRoutes)
// app.use('/api/v1/drugs', v1DrugRoutes)
// app.use('/api/v1/members', v1MemberRoutes)
// app.use('/api/v1/patients', v1PatientRoutes)
// app.use('/api/v1/financials', v1FinancialRoutes)
// app.use('/api/v1/sms', v1messageRoutes)


