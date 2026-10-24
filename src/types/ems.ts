export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Operations' | 'Human Resources' | 'Finance' | 'Sales';
  manager: string;
  joiningDate: string;
  status: 'Active' | 'Onboarding' | 'On Leave' | 'Notice Period' | 'Terminated';
  salary: {
    base: number;
    hra: number;
    allowances: number;
    deductions: number;
  };
  skills: string[];
  kpiRating: number; // 1 to 5 scale
  onboardingProgress?: number; // 0 to 100
  phone?: string;
  location?: string;
  panNumber?: string;
  pfUan?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Paid Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  quarter: string;
  targetMetric: string;
  currentProgress: number; // 0 to 100
  weight: number;
  status: 'On Track' | 'At Risk' | 'Exceeded' | 'Needs Improvement';
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  category: 'Workplace Conflict' | 'Compensation & Benefits' | 'Harassment & Ethics' | 'Managerial Feedback' | 'General Policy';
  subject: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Under Investigation' | 'Awaiting Feedback' | 'Resolved' | 'Closed';
  submittedDate: string;
  isConfidential: boolean;
  resolutionNote?: string;
}

export interface ExitProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  resignationDate: string;
  lastWorkingDay: string;
  reasonForLeaving: string;
  ktProgress: number; // 0 to 100
  assetRecoveryStatus: 'Pending' | 'In Progress' | 'Completed';
  exitInterviewDone: boolean;
  status: 'Initiated' | 'In Review' | 'Cleared';
}

export interface EMSNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'leave' | 'payroll' | 'performance' | 'grievance' | 'exit' | 'system';
  read: boolean;
  targetModule: string;
}
