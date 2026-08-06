import { Application } from "express";

import v1ServiceRoutes from "./routes/api/service-api";
import v1DepartmentRoutes from "./routes/api/department-api";
import v1BillingRoutes from "./routes/api/billing-api";
import v1AuthRoutes from "./routes/api/user-api";
import v1VitalRoutes from "./routes/api/vital-api";
import v1DrugRoutes from "./routes/api/drug-api";
import v1MedicalProviderRoutes from "./routes/api/medical-providers-api";
import v1PatientRoutes from "./routes/api/patient-api";
import v1FinancialRoutes from "./routes/api/financial-api";
import v1QueueRoutes from "./routes/api/queue-api";
import v1VisitRoutes from "./routes/api/visit-api";
import v1messageRoutes from "./routes/api/engagement-api";
import v1ClinicalNotesRoutes from "./routes/api/clinical-notes-api";
import v1AppointmentsRoutes from "./routes/api/appointments-api";

import v1Insureroutes from "./routes/api/insurance/insurer-api";
import v1BenefitPlanRoutes from "./routes/api/insurance/benefit-plan-api";
import v1PolcyRoutes from "./routes/api/insurance/policy-api";
import v1DiagnosisRoutes from "./routes/api/diagnosis-api";
import v1TestsRoutes from "./routes/api/tests-api";
import v1MedicationsRoutes from "./routes/api/medications-api";
import v1VisitClinicalNotesRoutes from "./routes/api/visit/visit-clinical-notes-api";
import v1TreatmentRoutes from "./routes/api/visit/visit-treatment-api";
import v1InvoiceRoutes from "./routes/api/visit/visit-invoice-api";
import v1NotificationRoutes from "./routes/api/notification-api";
import v1EmrAiRoutes from "./routes/api/emrAi-api";

import homeRoutes from "./routes/home";
import { authLimiter } from "./middleware/rateLimiters";
import "./models/Role";

/**
 * Mounts every feature router onto the app.
 *
 * Kept separate from createApp so tests can build a fully-wired
 * application without binding a port, and so route registration happens
 * synchronously in a known order rather than racing Apollo's startup.
 */
export const registerRoutes = (app: Application): Application => {
  app.use("/api/v1", homeRoutes);
  app.use("/api/v1/services", v1ServiceRoutes);
  app.use("/api/v1/departments", v1DepartmentRoutes);
  app.use("/api/v1/billings", v1BillingRoutes);
  app.use("/api/v1/vitals", v1VitalRoutes);
  app.use("/api/v1/auth", authLimiter, v1AuthRoutes);
  app.use("/api/v1/drugs", v1DrugRoutes);
  app.use("/api/v1/medical-providers", v1MedicalProviderRoutes);
  app.use("/api/v1/queues", v1QueueRoutes);
  app.use("/api/v1/visits", v1VisitRoutes);
  app.use("/api/v1/patients", v1PatientRoutes);
  app.use("/api/v1/financials", v1FinancialRoutes);
  app.use("/api/v1/clinical-notes", v1ClinicalNotesRoutes);
  app.use("/api/v1/appointments", v1AppointmentsRoutes);
  app.use("/api/v1/sms", v1messageRoutes);

  app.use("/api/v1/insurance/insurers", v1Insureroutes);
  app.use("/api/v1/insurance/benefit-plans", v1BenefitPlanRoutes);
  app.use("/api/v1/insurance/policies", v1PolcyRoutes);
  app.use("/api/v1/diagnosis", v1DiagnosisRoutes);
  app.use("/api/v1/tests", v1TestsRoutes);
  app.use("/api/v1/medications", v1MedicationsRoutes);
  app.use("/api/v1/visit-clinical-notes", v1VisitClinicalNotesRoutes);
  app.use("/api/v1/visit-treatments", v1TreatmentRoutes);
  app.use("/api/v1/visit-invoices", v1InvoiceRoutes);
  app.use("/api/v1/notifications", v1NotificationRoutes);

  app.use("/api/v1/ask-ai", v1EmrAiRoutes);

  return app;
};

export default registerRoutes;
