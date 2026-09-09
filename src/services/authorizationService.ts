import User from '../models/User';

export interface PermissionCheck {
  userId: string;
  resource: string;
  action: string;
  context?: {
    department?: string;
    patientStatus?: string;
    visitType?: string;
    dataSensitivity?: string;
    isEmergency?: boolean;
    patientId?: string;
    visitId?: string;
  };
}

export interface UserPermissions {
  role: {
    _id: string;
    name: string;
    display_name: string;
    permissions: Array<{
      resource: string;
      actions: string[];
      attributes: {
        department?: string[];
        patient_status?: string[];
        visit_type?: string[];
        data_sensitivity?: string[];
        time_restrictions?: {
          start_time?: string;
          end_time?: string;
        };
      };
      conditions: {
        own_patients_only: boolean;
        own_department_only: boolean;
        emergency_access: boolean;
      };
    }>;
  };
  permissions: Array<{
    resource: string;
    actions: string[];
    attributes: {
      department?: string[];
      patient_status?: string[];
      visit_type?: string[];
      data_sensitivity?: string[];
      time_restrictions?: {
        start_time?: string;
        end_time?: string;
      };
    };
    conditions: {
      own_patients_only: boolean;
      own_department_only: boolean;
      emergency_access: boolean;
    };
  }>;
  department: string;
}

export class AuthorizationService {
  /**
   * Get user permissions with role details
   */
  static async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    try {
      const user = await User.findById(userId).populate('role');
      if (!user || !user.role) {
        return null;
      }

      // Type assertion for populated role
      const populatedRole = user.role as any;

      return {
        role: populatedRole,
        permissions: populatedRole.permissions || [],
        department: user.department
      };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return null;
    }
  }

  /**
   * Check if user has permission for a specific action on a resource
   */
  static async checkPermission(check: PermissionCheck): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(check.userId);
      if (!userPermissions) {
        return false;
      }

      const { permissions, department } = userPermissions;
      const context = check.context || {};

      // Find permission for the resource
      const resourcePermission = permissions.find(p => p.resource === check.resource);
      if (!resourcePermission) {
        return false;
      }

      // Check if action is allowed
      if (!resourcePermission.actions.includes(check.action)) {
        return false;
      }

      // Check department restrictions
      if (resourcePermission.attributes.department && 
          resourcePermission.attributes.department.length > 0) {
        if (!resourcePermission.attributes.department.includes(department)) {
          return false;
        }
      }

      // Check patient status restrictions
      if (context.patientStatus && 
          resourcePermission.attributes.patient_status && 
          resourcePermission.attributes.patient_status.length > 0) {
        if (!resourcePermission.attributes.patient_status.includes(context.patientStatus)) {
          return false;
        }
      }

      // Check visit type restrictions
      if (context.visitType && 
          resourcePermission.attributes.visit_type && 
          resourcePermission.attributes.visit_type.length > 0) {
        if (!resourcePermission.attributes.visit_type.includes(context.visitType)) {
          return false;
        }
      }

      // Check data sensitivity restrictions
      if (context.dataSensitivity && 
          resourcePermission.attributes.data_sensitivity && 
          resourcePermission.attributes.data_sensitivity.length > 0) {
        if (!resourcePermission.attributes.data_sensitivity.includes(context.dataSensitivity)) {
          return false;
        }
      }

      // Check emergency access
      if (context.isEmergency && !resourcePermission.conditions.emergency_access) {
        return false;
      }

      // Check time restrictions
      if (resourcePermission.attributes.time_restrictions) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const { start_time, end_time } = resourcePermission.attributes.time_restrictions;
        if (start_time && end_time) {
          if (currentTime < start_time || currentTime > end_time) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if user can read a resource
   */
  static async canRead(userId: string, resource: string, context?: any): Promise<boolean> {
    return this.checkPermission({
      userId,
      resource,
      action: 'read',
      context
    });
  }

  /**
   * Check if user can write to a resource
   */
  static async canWrite(userId: string, resource: string, context?: any): Promise<boolean> {
    return this.checkPermission({
      userId,
      resource,
      action: 'write',
      context
    });
  }

  /**
   * Check if user can create a resource
   */
  static async canCreate(userId: string, resource: string, context?: any): Promise<boolean> {
    return this.checkPermission({
      userId,
      resource,
      action: 'create',
      context
    });
  }

  /**
   * Check if user can delete a resource
   */
  static async canDelete(userId: string, resource: string, context?: any): Promise<boolean> {
    return this.checkPermission({
      userId,
      resource,
      action: 'delete',
      context
    });
  }

  /**
   * Get user's allowed resources and actions
   */
  static async getUserAllowedActions(userId: string): Promise<Record<string, string[]>> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      if (!userPermissions) {
        return {};
      }

      const allowedActions: Record<string, string[]> = {};
      
      userPermissions.permissions.forEach(permission => {
        allowedActions[permission.resource] = permission.actions;
      });

      return allowedActions;
    } catch (error) {
      console.error('Error getting user allowed actions:', error);
      return {};
    }
  }

  /**
   * Check if user has any permission for a resource
   */
  static async hasAnyPermission(userId: string, resource: string): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      if (!userPermissions) {
        return false;
      }

      return userPermissions.permissions.some(p => p.resource === resource);
    } catch (error) {
      console.error('Error checking if user has any permission:', error);
      return false;
    }
  }

  /**
   * Get user's department-based permissions
   */
  static async getDepartmentPermissions(userId: string): Promise<string[]> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      if (!userPermissions) {
        return [];
      }

      const departmentPermissions: string[] = [];
      
      userPermissions.permissions.forEach(permission => {
        if (permission.attributes.department) {
          departmentPermissions.push(...permission.attributes.department);
        }
      });

      return [...new Set(departmentPermissions)]; // Remove duplicates
    } catch (error) {
      console.error('Error getting department permissions:', error);
      return [];
    }
  }
}

export default AuthorizationService; 