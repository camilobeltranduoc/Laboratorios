export interface Result {
  id: number;
  patientId: number;
  patientName: string;
  labId: number;
  labName: string;
  testType: string;
  result: string;
  date: string;
  notes?: string;
}
