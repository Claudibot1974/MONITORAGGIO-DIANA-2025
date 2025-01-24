export interface SubActivity {
  name: string;
  progress: number;
  notes?: string[];
  completed: boolean;
  targetCompletion?: {
    quarter: 1 | 2 | 3 | 4;
    year: number;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  progress: number;
  targetCompletion: {
    quarter: 1 | 2 | 3 | 4;
    year: number;
  };
  status: "On Track" | "At Risk" | "Not Started" | "Completed";
  subActivities: SubActivity[];
  notes: Note[];
  issues: Issue[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface SavedReport {
  id: string;
  name: string;
  date: string;
  activities: Activity[];
}

export interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  isEdited?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  author: string;
  timestamp: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
}
