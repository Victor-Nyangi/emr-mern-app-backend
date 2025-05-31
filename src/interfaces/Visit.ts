export interface VisitMedication {
    _id: string;
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    status: string;
    duration: string;
    prescribedBy: {
      first_name: string;
      last_name: string;
      salutation: string;
      _id: string;
    };
    patientId: string;
    visitId: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }
  