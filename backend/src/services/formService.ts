export interface FormField {
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export interface FormDefinition {
  id: string;
  type: string;
  title: string;
  description: string;
  chapters: number;
  fields: FormField[];
  sections: string[];
  accessLevel: 'staff' | 'manager' | 'director';
}

export const formDefinitions: FormDefinition[] = [
  {
    id: 'c1',
    type: 'workforce-request',
    title: 'C1: Workforce Request',
    description: 'Request for new staff member',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Position Details', 'Budget Approval', 'Timeline'],
    fields: [
      {
        name: 'position',
        type: 'text',
        label: 'Position Title',
        required: true,
        placeholder: 'e.g., Physiotherapist',
      },
      {
        name: 'department',
        type: 'text',
        label: 'Department',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Role Description',
        required: true,
        helpText: 'Key responsibilities and requirements',
      },
      {
        name: 'employmentType',
        type: 'select',
        label: 'Employment Type',
        required: true,
        options: ['Full-time', 'Part-time', 'Casual', 'Contract'],
      },
      {
        name: 'salary',
        type: 'number',
        label: 'Annual Salary ($)',
        required: true,
      },
      {
        name: 'startDate',
        type: 'date',
        label: 'Required Start Date',
        required: true,
      },
      {
        name: 'approvedBy',
        type: 'text',
        label: 'Approved By (Director)',
        required: true,
      },
    ],
  },
  {
    id: 'c2',
    type: 'interview-scoring',
    title: 'C2: Interview Scoring Matrix',
    description: 'Score candidates during interview process',
    chapters: 2,
    accessLevel: 'manager',
    sections: ['Candidate Info', 'Scoring Criteria'],
    fields: [
      {
        name: 'candidateName',
        type: 'text',
        label: 'Candidate Name',
        required: true,
      },
      {
        name: 'position',
        type: 'text',
        label: 'Position Applied For',
        required: true,
      },
      {
        name: 'technicalSkills',
        type: 'number',
        label: 'Technical Skills (1-5)',
        required: true,
      },
      {
        name: 'customerService',
        type: 'number',
        label: 'Customer Service (1-5)',
        required: true,
      },
      {
        name: 'teamwork',
        type: 'number',
        label: 'Teamwork (1-5)',
        required: true,
      },
      {
        name: 'communication',
        type: 'number',
        label: 'Communication (1-5)',
        required: true,
      },
      {
        name: 'notes',
        type: 'textarea',
        label: 'Additional Notes',
        required: false,
      },
    ],
  },
  {
    id: 'c3',
    type: 'reference-check',
    title: 'C3: Reference Check',
    description: 'Verify employment history and performance',
    chapters: 2,
    accessLevel: 'manager',
    sections: ['Referee Details', 'Reference Questions'],
    fields: [
      {
        name: 'refereeeName',
        type: 'text',
        label: "Referee's Name",
        required: true,
      },
      {
        name: 'refereePosition',
        type: 'text',
        label: "Referee's Position",
        required: true,
      },
      {
        name: 'refereePhone',
        type: 'text',
        label: "Referee's Phone",
        required: true,
      },
      {
        name: 'refereEmail',
        type: 'email',
        label: "Referee's Email",
        required: true,
      },
      {
        name: 'recommendForRole',
        type: 'select',
        label: 'Recommended for Role?',
        required: true,
        options: ['Yes', 'No', 'Unsure'],
      },
      {
        name: 'strengths',
        type: 'textarea',
        label: 'Key Strengths',
        required: true,
      },
      {
        name: 'concerns',
        type: 'textarea',
        label: 'Any Concerns',
        required: false,
      },
    ],
  },
  {
    id: 'c4',
    type: 'pre-employment',
    title: 'C4: Pre-Employment Compliance',
    description: 'Verify pre-employment requirements met',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Compliance Checklist'],
    fields: [
      {
        name: 'policeCheck',
        type: 'checkbox',
        label: 'Police Clearance Completed',
        required: true,
      },
      {
        name: 'workingWithChildren',
        type: 'checkbox',
        label: 'Working with Children Check (WWCC)',
        required: true,
      },
      {
        name: 'healthcareReg',
        type: 'checkbox',
        label: 'Healthcare Worker Registration',
        required: true,
      },
      {
        name: 'indemnity',
        type: 'checkbox',
        label: 'Professional Indemnity Insurance',
        required: true,
      },
      {
        name: 'healthScreening',
        type: 'checkbox',
        label: 'Occupational Health Screening',
        required: true,
      },
      {
        name: 'notes',
        type: 'textarea',
        label: 'Compliance Notes',
        required: false,
      },
    ],
  },
  {
    id: 'c5',
    type: 'onboarding',
    title: 'C5: Onboarding Checklist',
    description: 'First day preparation tasks',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Pre-Arrival', 'First Day', 'First Week'],
    fields: [
      {
        name: 'workspaceReady',
        type: 'checkbox',
        label: 'Workspace Set Up',
        required: true,
      },
      {
        name: 'equipmentIssued',
        type: 'checkbox',
        label: 'Equipment & Keys Issued',
        required: true,
      },
      {
        name: 'welcomePacket',
        type: 'checkbox',
        label: 'Welcome Packet Prepared',
        required: true,
      },
      {
        name: 'itAccess',
        type: 'checkbox',
        label: 'IT Access Set Up',
        required: true,
      },
      {
        name: 'orientationScheduled',
        type: 'checkbox',
        label: 'Orientation Scheduled',
        required: true,
      },
      {
        name: 'notes',
        type: 'textarea',
        label: 'Notes',
        required: false,
      },
    ],
  },
  {
    id: 'c6',
    type: 'deputy-tasks',
    title: 'C6: Deputy Task List',
    description: 'Daily/weekly operational tasks',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Task Assignments'],
    fields: [
      {
        name: 'assignedTo',
        type: 'text',
        label: 'Assigned To',
        required: true,
      },
      {
        name: 'taskDescription',
        type: 'textarea',
        label: 'Task Description',
        required: true,
      },
      {
        name: 'dueDate',
        type: 'date',
        label: 'Due Date',
        required: true,
      },
      {
        name: 'priority',
        type: 'select',
        label: 'Priority',
        required: true,
        options: ['Low', 'Medium', 'High', 'Urgent'],
      },
    ],
  },
  {
    id: 'c7',
    type: 'probation-review',
    title: 'C7: Probation Review',
    description: 'End of probation assessment',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Performance Assessment', 'Recommendation'],
    fields: [
      {
        name: 'performanceRating',
        type: 'select',
        label: 'Overall Performance',
        required: true,
        options: ['Exceeds Expectations', 'Meets Expectations', 'Needs Improvement', 'Unsatisfactory'],
      },
      {
        name: 'strengths',
        type: 'textarea',
        label: 'Key Strengths',
        required: true,
      },
      {
        name: 'areasForDevelopment',
        type: 'textarea',
        label: 'Areas for Development',
        required: false,
      },
      {
        name: 'recommendation',
        type: 'select',
        label: 'Recommendation',
        required: true,
        options: ['Confirm Employment', 'Extend Probation', 'Terminate'],
      },
    ],
  },
  {
    id: 'c8',
    type: 'supervision',
    title: 'C8: Supervision & One-to-One Record',
    description: 'Record supervision meetings and discussions',
    chapters: 1,
    accessLevel: 'manager',
    sections: ['Meeting Details', 'Discussion Topics', 'Action Items'],
    fields: [
      {
        name: 'staffMember',
        type: 'text',
        label: 'Staff Member',
        required: true,
      },
      {
        name: 'supervisorName',
        type: 'text',
        label: 'Supervisor Name',
        required: true,
      },
      {
        name: 'meetingDate',
        type: 'date',
        label: 'Meeting Date',
        required: true,
      },
      {
        name: 'topics',
        type: 'textarea',
        label: 'Discussion Topics',
        required: true,
      },
      {
        name: 'actionItems',
        type: 'textarea',
        label: 'Action Items',
        required: false,
      },
      {
        name: 'nextReviewDate',
        type: 'date',
        label: 'Next Review Date',
        required: true,
      },
    ],
  },
];

export class FormService {
  static getFormDefinition(formType: string): FormDefinition | undefined {
    return formDefinitions.find((f) => f.type === formType);
  }

  static getAllForms(): FormDefinition[] {
    return formDefinitions;
  }

  static getFormsByAccessLevel(accessLevel: string): FormDefinition[] {
    return formDefinitions.filter(
      (f) =>
        f.accessLevel === 'staff' ||
        (f.accessLevel === 'manager' && accessLevel !== 'staff') ||
        accessLevel === 'director'
    );
  }
}

export default FormService;
