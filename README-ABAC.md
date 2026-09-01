# Attribute-Based Access Control (ABAC) Implementation

This document describes the implementation of Attribute-Based Access Control (ABAC) in the EMR system, providing fine-grained permissions based on user roles, departments, and contextual attributes.

## Overview

The ABAC system provides:
- **Role-based permissions** with predefined roles (admin, doctor, nurse, etc.)
- **Department-based access control** restricting users to specific departments
- **Attribute-based conditions** including patient status, visit type, data sensitivity
- **Time-based restrictions** for certain operations
- **Emergency access controls** for critical situations
- **Frontend permission guards** for UI-level access control

## Architecture

### Backend Components

1. **Role Model** (`src/models/Role.ts`)
   - Defines roles and their permissions
   - Stores attribute-based conditions
   - Supports time restrictions and emergency access

2. **User Model** (`src/models/User.ts`)
   - Extended with role and department fields
   - Links users to specific roles and departments

3. **Authorization Service** (`src/services/authorizationService.ts`)
   - Core ABAC logic implementation
   - Permission checking with context
   - User permission retrieval

4. **Authorization Middleware** (`src/middleware/authorizationMiddleware.ts`)
   - Route-level permission enforcement
   - Predefined middleware for common operations
   - Context extraction from requests

### Frontend Components

1. **Auth Store** (`lib/auth-store.ts`)
   - Zustand-based state management
   - Permission checking methods
   - Persistent authentication state

2. **Permission Guards** (`components/auth/PermissionGuard.tsx`)
   - React components for conditional rendering
   - Resource-specific permission checks
   - Admin and department guards

3. **Permission Display** (`components/auth/PermissionDisplay.tsx`)
   - Debug component showing user permissions
   - Permission matrix visualization
   - Quick permission tests

## Roles and Permissions

### Available Roles

1. **Admin** - Full system access
2. **Doctor** - Patient care with department restrictions
3. **Nurse** - Patient care with time and department restrictions
4. **Receptionist** - Limited patient and appointment access
5. **Billing Specialist** - Billing and financial access
6. **Lab Technician** - Laboratory-specific access

### Permission Attributes

Each permission includes:
- **Resource**: patient, visit, appointment, medical_provider, billing, clinical_notes
- **Actions**: read, write, create, delete
- **Department restrictions**: Which departments can be accessed
- **Patient status restrictions**: Which patient statuses are accessible
- **Visit type restrictions**: Which visit types are allowed
- **Data sensitivity levels**: public, confidential, restricted, emergency_only
- **Time restrictions**: Start and end times for operations
- **Conditions**: Emergency access, own patients only, department only

## Setup Instructions

### 1. Database Setup

Run the seeder to create roles and test users:

```bash
cd emr-mern-app-backend
npm run seed
```

This will create:
- All role definitions with permissions
- Default admin user (admin@emr.com / admin123)
- Test users for each role

### 2. Backend Configuration

The authorization middleware is ready to use. Apply it to routes:

```typescript
import { requireVisitRead, requirePatientCreate } from '../middleware/authorizationMiddleware';

// Apply to routes
router.get('/visits', requireVisitRead, visitController.getVisits);
router.post('/patients', requirePatientCreate, patientController.createPatient);
```

### 3. Frontend Integration

The frontend components are ready to use:

```tsx
import { CanReadVisit, CanCreatePatient, AdminOnly } from '@/components/auth/PermissionGuard';

// Conditional rendering
<CanReadVisit>
  <VisitList />
</CanReadVisit>

<CanCreatePatient>
  <CreatePatientButton />
</CanCreatePatient>

<AdminOnly>
  <AdminPanel />
</AdminOnly>
```

## Usage Examples

### Backend Permission Checking

```typescript
// In controllers
const hasPermission = await AuthorizationService.checkPermission({
  userId: user._id,
  resource: 'patient',
  action: 'read',
  context: {
    department: 'cardiology',
    patientStatus: 'active',
    isEmergency: false
  }
});
```

### Frontend Permission Checking

```typescript
// In components
const { canRead, hasPermission } = useAuthStore();

if (canRead('patient')) {
  // Show patient data
}

if (hasPermission('visit', 'create', { 
  department: 'emergency',
  isEmergency: true 
})) {
  // Allow emergency visit creation
}
```

### Route Protection

```typescript
// Protect routes with middleware
router.get('/patients/:id', requirePatientRead, patientController.getPatient);
router.post('/visits', requireVisitCreate, visitController.createVisit);
router.put('/appointments/:id', requireAppointmentWrite, appointmentController.updateAppointment);
```

## Test Users

After running the seeder, you can test with these accounts:

| Role | Email | Password | Department | Permissions |
|------|-------|----------|------------|-------------|
| Admin | admin@emr.com | admin123 | general | Full access |
| Doctor | doctor@emr.com | doctor123 | cardiology | Patient care, department restricted |
| Nurse | nurse@emr.com | nurse123 | emergency | Patient care, time restricted |
| Receptionist | receptionist@emr.com | receptionist123 | general | Limited access |
| Billing | billing@emr.com | billing123 | billing | Billing access |
| Lab Tech | lab@emr.com | lab123 | laboratory | Lab access |

## Permission Matrix

| Role | Patient | Visit | Appointment | Medical Provider | Billing | Clinical Notes |
|------|---------|-------|-------------|------------------|---------|----------------|
| Admin | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| Doctor | CRU | CRU | CRU | R | - | CRU |
| Nurse | CRU | CRU | R | - | - | RW |
| Receptionist | CR | R | CRU | - | - | - |
| Billing | R | R | - | - | CRUD | - |
| Lab Tech | R | RW | - | - | - | RW |

Legend: C=Create, R=Read, U=Update, D=Delete, -=No Access

## Context-Aware Permissions

The system supports context-aware permission checking:

```typescript
// Emergency access
const emergencyContext = {
  isEmergency: true,
  department: 'emergency',
  dataSensitivity: 'emergency_only'
};

// Department-specific access
const cardiologyContext = {
  department: 'cardiology',
  patientStatus: 'active'
};

// Time-restricted access
const timeContext = {
  visitType: 'consultation',
  dataSensitivity: 'confidential'
};
```

## Security Considerations

1. **Backend Validation**: All permission checks are enforced on the backend
2. **Frontend Enhancement**: Frontend guards provide better UX but don't replace backend security
3. **Context Validation**: Always validate context data before permission checks
4. **Audit Logging**: Consider adding audit logs for permission checks
5. **Token Security**: JWT tokens include user permissions but should be validated server-side

## Extending the System

### Adding New Roles

1. Update the Role model enum
2. Add role definition to `src/data/permissions.ts`
3. Create test users in the seeder
4. Update frontend components if needed

### Adding New Resources

1. Add resource to the ResourceType enum
2. Update permission definitions
3. Create new permission guards
4. Add to permission display component

### Adding New Attributes

1. Extend the permission schema
2. Update the authorization service
3. Modify frontend permission checking
4. Update documentation

## Troubleshooting

### Common Issues

1. **Permission not working**: Check if user has the correct role assigned
2. **Department access denied**: Verify user's department matches permission requirements
3. **Time restrictions**: Check if current time is within allowed range
4. **Frontend not updating**: Ensure Zustand store is properly initialized

### Debug Tools

Use the PermissionDisplay component to debug permission issues:

```tsx
import PermissionDisplay from '@/components/auth/PermissionDisplay';

// Add to any page for debugging
<PermissionDisplay />
```

This will show:
- Current user permissions
- Permission matrix
- Department access
- Quick permission tests
- Detailed permission breakdown 