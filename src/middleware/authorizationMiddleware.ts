import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import AuthorizationService from "../services/authorizationService";

// Define resource types
export enum ResourceType {
  PATIENT = 'patient',
  VISIT = 'visit',
  APPOINTMENT = 'appointment',
  MEDICAL_PROVIDER = 'medical_provider',
  BILLING = 'billing',
  CLINICAL_NOTES = 'clinical_notes'
}

// Define actions
export enum Action {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  CREATE = 'create'
}

// Middleware to check permissions
export const requirePermission = (resource: ResourceType, action: Action) => {
  return expressAsyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      // Get user from request (set by auth middleware)
      const user = req.user;
      
      if (!user) {
        res.status(401);
        throw new Error("User not authenticated");
      }

      // Get context from request body or query params
      const context = {
        department: req.body.department || req.query.department,
        patientStatus: req.body.patientStatus || req.query.patientStatus,
        visitType: req.body.visitType || req.query.visitType,
        dataSensitivity: req.body.dataSensitivity || req.query.dataSensitivity,
        isEmergency: req.body.isEmergency || req.query.isEmergency === 'true',
        patientId: req.body.patientId || req.query.patientId || req.params.patientId,
        visitId: req.body.visitId || req.query.visitId || req.params.visitId
      };

      // Check if user has permission
      const hasPermission = await AuthorizationService.checkPermission({
        userId: user._id,
        resource,
        action,
        context
      });

      if (!hasPermission) {
        res.status(403);
        throw new Error(`Insufficient permissions. Required: ${action} on ${resource}`);
      }

      next();
    } catch (error) {
      res.status(403);
      throw new Error("Access denied");
    }
  });
};

// Specific permission middlewares for common operations
export const requirePatientRead = requirePermission(ResourceType.PATIENT, Action.READ);
export const requirePatientWrite = requirePermission(ResourceType.PATIENT, Action.WRITE);
export const requirePatientCreate = requirePermission(ResourceType.PATIENT, Action.CREATE);
export const requirePatientDelete = requirePermission(ResourceType.PATIENT, Action.DELETE);

export const requireVisitRead = requirePermission(ResourceType.VISIT, Action.READ);
export const requireVisitWrite = requirePermission(ResourceType.VISIT, Action.WRITE);
export const requireVisitCreate = requirePermission(ResourceType.VISIT, Action.CREATE);
export const requireVisitDelete = requirePermission(ResourceType.VISIT, Action.DELETE);

export const requireAppointmentRead = requirePermission(ResourceType.APPOINTMENT, Action.READ);
export const requireAppointmentWrite = requirePermission(ResourceType.APPOINTMENT, Action.WRITE);
export const requireAppointmentCreate = requirePermission(ResourceType.APPOINTMENT, Action.CREATE);
export const requireAppointmentDelete = requirePermission(ResourceType.APPOINTMENT, Action.DELETE);

export const requireMedicalProviderRead = requirePermission(ResourceType.MEDICAL_PROVIDER, Action.READ);
export const requireMedicalProviderWrite = requirePermission(ResourceType.MEDICAL_PROVIDER, Action.WRITE);
export const requireMedicalProviderCreate = requirePermission(ResourceType.MEDICAL_PROVIDER, Action.CREATE);
export const requireMedicalProviderDelete = requirePermission(ResourceType.MEDICAL_PROVIDER, Action.DELETE);

export const requireBillingRead = requirePermission(ResourceType.BILLING, Action.READ);
export const requireBillingWrite = requirePermission(ResourceType.BILLING, Action.WRITE);
export const requireBillingCreate = requirePermission(ResourceType.BILLING, Action.CREATE);
export const requireBillingDelete = requirePermission(ResourceType.BILLING, Action.DELETE);

export const requireClinicalNotesRead = requirePermission(ResourceType.CLINICAL_NOTES, Action.READ);
export const requireClinicalNotesWrite = requirePermission(ResourceType.CLINICAL_NOTES, Action.WRITE);
export const requireClinicalNotesCreate = requirePermission(ResourceType.CLINICAL_NOTES, Action.CREATE);
export const requireClinicalNotesDelete = requirePermission(ResourceType.CLINICAL_NOTES, Action.DELETE);

// Admin-only middleware
export const requireAdmin = expressAsyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    // Get user permissions to check if they're admin
    const userPermissions = await AuthorizationService.getUserPermissions(user._id);
    if (!userPermissions || userPermissions.role.name !== 'admin') {
      res.status(403);
      throw new Error("Admin access required");
    }

    next();
  } catch (error) {
    res.status(403);
    throw new Error("Access denied");
  }
});

// Department-based middleware
export const requireDepartmentAccess = (requiredDepartment: string) => {
  return expressAsyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401);
        throw new Error("User not authenticated");
      }

      // Check if user's department matches required department
      if (user.department !== requiredDepartment) {
        res.status(403);
        throw new Error(`Access denied. Required department: ${requiredDepartment}`);
      }

      next();
    } catch (error) {
      res.status(403);
      throw new Error("Access denied");
    }
  });
};

export default {
  requirePermission,
  requirePatientRead,
  requirePatientWrite,
  requirePatientCreate,
  requirePatientDelete,
  requireVisitRead,
  requireVisitWrite,
  requireVisitCreate,
  requireVisitDelete,
  requireAppointmentRead,
  requireAppointmentWrite,
  requireAppointmentCreate,
  requireAppointmentDelete,
  requireMedicalProviderRead,
  requireMedicalProviderWrite,
  requireMedicalProviderCreate,
  requireMedicalProviderDelete,
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
  requireAdmin,
  requireDepartmentAccess,
  ResourceType,
  Action
}; 