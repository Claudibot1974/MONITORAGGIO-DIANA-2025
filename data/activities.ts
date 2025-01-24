import { Activity } from "@/types";

export const activities: Activity[] = [
  {
    id: 1,
    name: "PREEF Unit Support",
    description: "Support for RTU Installation Plan",
    progress: 15,
    targetCompletion: {
      quarter: 4,
      year: 2025
    },
    status: "At Risk",
    subActivities: [
      { 
        name: "RTU Installation Planning", 
        progress: 20, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2025
        }
      },
      { 
        name: "Operating Instructions Alignment", 
        progress: 10, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 2,
    name: "RTU Replacement",
    description: "EDA Attikis RTU Replacement",
    progress: 25,
    targetCompletion: {
      quarter: 4,
      year: 2025
    },
    status: "On Track",
    subActivities: [
      { 
        name: "Technical Specifications", 
        progress: 45, 
        completed: false,
        targetCompletion: {
          quarter: 3,
          year: 2025
        }
      },
      { 
        name: "Replacement Planning", 
        progress: 5, 
        completed: false,
        targetCompletion: {
          quarter: 3,
          year: 2025
        }
      },
      { 
        name: "Pilot Installation", 
        progress: 0, 
        completed: false,
        targetCompletion: {
          quarter: 4,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 3,
    name: "Remote Odorization",
    description: "Control & Dashboard Implementation",
    progress: 30,
    targetCompletion: {
      quarter: 4,
      year: 2025
    },
    status: "On Track",
    subActivities: [
      { 
        name: "Remote Control Setup", 
        progress: 35, 
        completed: false,
        targetCompletion: {
          quarter: 3,
          year: 2025
        }
      },
      { 
        name: "Dashboard Development", 
        progress: 25, 
        completed: false,
        targetCompletion: {
          quarter: 4,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 4,
    name: "WinCC OA Upgrade & MD Convergence",
    description: "Version 3.20 Upgrade & System Integration",
    progress: 40,
    targetCompletion: {
      quarter: 2,
      year: 2025
    },
    status: "At Risk",
    subActivities: [
      { 
        name: "Pre-upgrade Testing", 
        progress: 60, 
        completed: false,
        targetCompletion: {
          quarter: 1,
          year: 2025
        }
      },
      { 
        name: "System Validation", 
        progress: 20, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2025
        }
      },
      { 
        name: "SCADA Integration", 
        progress: 15, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [
      {
        id: "issue-1",
        title: "Compatibility Issues",
        description: "Potential compatibility issues with existing systems identified during testing",
        severity: "High",
        status: "Open",
        author: "System Admin",
        timestamp: new Date().toISOString(),
        comments: []
      }
    ],
    attachments: []
  },
  {
    id: 5,
    name: "Remote Control Manual",
    description: "Documentation & Training",
    progress: 20,
    targetCompletion: {
      quarter: 3,
      year: 2025
    },
    status: "On Track",
    subActivities: [
      { 
        name: "Manual Development", 
        progress: 25, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2025
        }
      },
      { 
        name: "Net Mân Training", 
        progress: 15, 
        completed: false,
        targetCompletion: {
          quarter: 3,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 6,
    name: "Remote Control Standards",
    description: "Asset Control Standardization",
    progress: 15,
    targetCompletion: {
      quarter: 4,
      year: 2025
    },
    status: "On Track",
    subActivities: [
      { 
        name: "Standards Definition", 
        progress: 20, 
        completed: false,
        targetCompletion: {
          quarter: 3,
          year: 2025
        }
      },
      { 
        name: "Implementation Planning", 
        progress: 10, 
        completed: false,
        targetCompletion: {
          quarter: 4,
          year: 2025
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 7,
    name: "Progress Reporting",
    description: "Monthly Presentations",
    progress: 100,
    targetCompletion: {
      quarter: 4,
      year: 2024
    },
    status: "Completed",
    subActivities: [
      { 
        name: "Data Collection", 
        progress: 100, 
        completed: true,
        targetCompletion: {
          quarter: 4,
          year: 2024
        }
      },
      { 
        name: "Presentation Preparation", 
        progress: 100, 
        completed: true,
        targetCompletion: {
          quarter: 4,
          year: 2024
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 8,
    name: "Budget Monitoring",
    description: "ATI Budget Tracking",
    progress: 100,
    targetCompletion: {
      quarter: 4,
      year: 2024
    },
    status: "Completed",
    subActivities: [
      { 
        name: "Monthly Reviews", 
        progress: 100, 
        completed: true,
        targetCompletion: {
          quarter: 4,
          year: 2024
        }
      },
      { 
        name: "Variance Analysis", 
        progress: 100, 
        completed: true,
        targetCompletion: {
          quarter: 4,
          year: 2024
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  },
  {
    id: 9,
    name: "DANA Implementation",
    description: "System Integration",
    progress: 5,
    targetCompletion: {
      quarter: 1,
      year: 2026
    },
    status: "Not Started",
    subActivities: [
      { 
        name: "System Customization", 
        progress: 5, 
        completed: false,
        targetCompletion: {
          quarter: 1,
          year: 2026
        }
      },
      { 
        name: "SCADA Integration", 
        progress: 0, 
        completed: false,
        targetCompletion: {
          quarter: 2,
          year: 2026
        }
      }
    ],
    notes: [],
    issues: [],
    attachments: []
  }
];

export const mockUsers: { [key: string]: string } = {
  "user1": "Project Manager",
  "user2": "Technical Lead",
  "user3": "Team Member"
};
