'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Activity, Note, Issue, SavedReport } from '@/types';
import { activities as initialActivities } from '@/data/activities';
import ActivityCard from '@/components/activity-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [currentUser] = useState('Team Member');
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    targetCompletion: {
      quarter: 1 as 1 | 2 | 3 | 4,
      year: new Date().getFullYear()
    }
  });
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const savedReportsStr = localStorage.getItem('savedReports');
    if (savedReportsStr) {
      setSavedReports(JSON.parse(savedReportsStr));
    }

    const lastReportStr = localStorage.getItem('lastReport');
    if (lastReportStr) {
      setActivities(JSON.parse(lastReportStr));
    }
  }, []);

  const handleAddNote = (activityId: number, noteContent: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const newNote: Note = {
          id: uuidv4(),
          content: noteContent,
          author: currentUser,
          timestamp: new Date().toISOString()
        };
        return {
          ...activity,
          notes: [...activity.notes, newNote]
        };
      }
      return activity;
    }));
  };

  const handleEditNote = (activityId: number, noteId: string, content: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          notes: activity.notes.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                content,
                isEdited: true
              };
            }
            return note;
          })
        };
      }
      return activity;
    }));
  };

  const handleDeleteNote = (activityId: number, noteId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          notes: activity.notes.filter(note => note.id !== noteId)
        };
      }
      return activity;
    }));
  };

  const handleAddIssue = (activityId: number, issueData: { title: string; description: string; severity: 'Low' | 'Medium' | 'High' }) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const newIssue: Issue = {
          id: uuidv4(),
          ...issueData,
          author: currentUser,
          timestamp: new Date().toISOString(),
          status: 'Open',
          comments: []
        };
        return {
          ...activity,
          issues: [...activity.issues, newIssue]
        };
      }
      return activity;
    }));
  };

  const handleEditIssue = (activityId: number, issueId: string, issueData: { title: string; description: string; severity: 'Low' | 'Medium' | 'High' }) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          issues: activity.issues.map(issue => {
            if (issue.id === issueId) {
              return {
                ...issue,
                ...issueData
              };
            }
            return issue;
          })
        };
      }
      return activity;
    }));
  };

  const handleDeleteIssue = (activityId: number, issueId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          issues: activity.issues.filter(issue => issue.id !== issueId)
        };
      }
      return activity;
    }));
  };

  const handleToggleSubActivity = (activityId: number, subActivityName: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          subActivities: activity.subActivities.map(sub => {
            if (sub.name === subActivityName) {
              return { ...sub, completed: !sub.completed };
            }
            return sub;
          })
        };
      }
      return activity;
    }));
  };

  const handleUpdateProgress = (activityId: number, subActivityName: string, progress: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const updatedSubActivities = activity.subActivities.map(sub => {
          if (sub.name === subActivityName) {
            return { ...sub, progress };
          }
          return sub;
        });
        
        const totalProgress = updatedSubActivities.reduce((acc, curr) => acc + curr.progress, 0);
        const newProgress = Math.round(totalProgress / updatedSubActivities.length);
        
        return {
          ...activity,
          progress: newProgress,
          subActivities: updatedSubActivities
        };
      }
      return activity;
    }));
  };

  const handleUpdateTargetCompletion = (activityId: number, subActivityName: string, targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number }) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          subActivities: activity.subActivities.map(sub => {
            if (sub.name === subActivityName) {
              return { ...sub, targetCompletion };
            }
            return sub;
          })
        };
      }
      return activity;
    }));
  };

  const handleUpdateStreamTargetCompletion = (activityId: number, targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number }) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          targetCompletion
        };
      }
      return activity;
    }));
  };

  const handleAddSubActivity = (activityId: number, subActivity: { name: string; targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number } }) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          subActivities: [...activity.subActivities, {
            name: subActivity.name,
            progress: 0,
            completed: false,
            targetCompletion: subActivity.targetCompletion
          }]
        };
      }
      return activity;
    }));
  };

  const handleAddActivity = () => {
    if (newActivity.name.trim() && newActivity.description.trim()) {
      const newId = Math.max(...activities.map(a => a.id)) + 1;
      setActivities([...activities, {
        id: newId,
        name: newActivity.name,
        description: newActivity.description,
        progress: 0,
        targetCompletion: newActivity.targetCompletion,
        status: "Not Started",
        subActivities: [],
        notes: [],
        issues: [],
        attachments: []
      }]);
      setNewActivity({
        name: '',
        description: '',
        targetCompletion: {
          quarter: 1,
          year: new Date().getFullYear()
        }
      });
    }
  };

  const handleAddAttachment = (activityId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setActivities(activities.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            attachments: [...(activity.attachments || []), {
              id: uuidv4(),
              name: file.name,
              url
            }]
          };
        }
        return activity;
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAttachment = (activityId: number, attachmentId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          attachments: activity.attachments?.filter(att => att.id !== attachmentId) || []
        };
      }
      return activity;
    }));
  };

  const handleSaveReport = () => {
    const report: SavedReport = {
      id: uuidv4(),
      name: `Report ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      activities
    };
    const updatedReports = [...savedReports, report];
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
    localStorage.setItem('lastReport', JSON.stringify(activities));
  };

  const handleLoadReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    if (report) {
      setActivities(report.activities);
      localStorage.setItem('lastReport', JSON.stringify(report.activities));
    }
  };

  const generateReport = async () => {
    const element = document.getElementById('activities-container');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `diana-activities-report-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const getStatusCount = (status: Activity['status']) => {
    return activities.filter(a => a.status === status).length;
  };

  const getOverallProgress = () => {
    const total = activities.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / activities.length);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">DIANA Activities Monitor</h1>
          <div className="flex gap-2">
            <Button onClick={generateReport}>Generate Report Image</Button>
            <Button onClick={handleSaveReport}>Save Report</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Load Report</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Saved Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {savedReports.map(report => (
                    <Button
                      key={report.id}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleLoadReport(report.id)}
                    >
                      <span>{report.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold">On Track</h3>
            <p className="text-2xl">{getStatusCount('On Track')}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-semibold">At Risk</h3>
            <p className="text-2xl">{getStatusCount('At Risk')}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold">Not Started</h3>
            <p className="text-2xl">{getStatusCount('Not Started')}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold">Overall Progress</h3>
            <p className="text-2xl">{getOverallProgress()}%</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Stream
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Stream</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Stream name"
                className="w-full p-2 border rounded"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  className="w-full p-2 border rounded"
                  value={newActivity.targetCompletion.quarter}
                  onChange={(e) => setNewActivity({
                    ...newActivity,
                    targetCompletion: {
                      ...newActivity.targetCompletion,
                      quarter: Number(e.target.value) as 1 | 2 | 3 | 4
                    }
                  })}
                >
                  {[1, 2, 3, 4].map(quarter => (
                    <option key={quarter} value={quarter}>Q{quarter}</option>
                  ))}
                </select>
                <select
                  className="w-full p-2 border rounded"
                  value={newActivity.targetCompletion.year}
                  onChange={(e) => setNewActivity({
                    ...newActivity,
                    targetCompletion: {
                      ...newActivity.targetCompletion,
                      year: Number(e.target.value)
                    }
                  })}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddActivity}>Add Stream</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="at-risk">At Risk</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>

        <div id="activities-container">
          <TabsContent value="all" className="space-y-4">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onAddIssue={handleAddIssue}
                onEditIssue={handleEditIssue}
                onDeleteIssue={handleDeleteIssue}
                onToggleSubActivity={handleToggleSubActivity}
                onUpdateProgress={handleUpdateProgress}
                onUpdateTargetCompletion={handleUpdateTargetCompletion}
                onUpdateStreamTargetCompletion={handleUpdateStreamTargetCompletion}
                onAddSubActivity={handleAddSubActivity}
                onAddAttachment={handleAddAttachment}
                onDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </TabsContent>

          <TabsContent value="at-risk" className="space-y-4">
            {activities
              .filter(a => a.status === 'At Risk')
              .map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                  onAddIssue={handleAddIssue}
                  onEditIssue={handleEditIssue}
                  onDeleteIssue={handleDeleteIssue}
                  onToggleSubActivity={handleToggleSubActivity}
                  onUpdateProgress={handleUpdateProgress}
                  onUpdateTargetCompletion={handleUpdateTargetCompletion}
                  onUpdateStreamTargetCompletion={handleUpdateStreamTargetCompletion}
                  onAddSubActivity={handleAddSubActivity}
                  onAddAttachment={handleAddAttachment}
                  onDeleteAttachment={handleDeleteAttachment}
                />
              ))}
          </TabsContent>

          <TabsContent value="not-started" className="space-y-4">
            {activities
              .filter(a => a.status === 'Not Started')
              .map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                  onAddIssue={handleAddIssue}
                  onEditIssue={handleEditIssue}
                  onDeleteIssue={handleDeleteIssue}
                  onToggleSubActivity={handleToggleSubActivity}
                  onUpdateProgress={handleUpdateProgress}
                  onUpdateTargetCompletion={handleUpdateTargetCompletion}
                  onUpdateStreamTargetCompletion={handleUpdateStreamTargetCompletion}
                  onAddSubActivity={handleAddSubActivity}
                  onAddAttachment={handleAddAttachment}
                  onDeleteAttachment={handleDeleteAttachment}
                />
              ))}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
