import React, { useState, useRef } from 'react';
import { Activity, Issue, SubActivity } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, AlertTriangle, Plus, Paperclip, X } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
  onAddNote: (activityId: number, note: string) => void;
  onEditNote: (activityId: number, noteId: string, content: string) => void;
  onDeleteNote: (activityId: number, noteId: string) => void;
  onAddIssue: (activityId: number, issue: { title: string; description: string; severity: 'Low' | 'Medium' | 'High' }) => void;
  onEditIssue: (activityId: number, issueId: string, issue: { title: string; description: string; severity: 'Low' | 'Medium' | 'High' }) => void;
  onDeleteIssue: (activityId: number, issueId: string) => void;
  onToggleSubActivity: (activityId: number, subActivityName: string) => void;
  onUpdateProgress: (activityId: number, subActivityName: string, progress: number) => void;
  onUpdateTargetCompletion: (activityId: number, subActivityName: string, targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number }) => void;
  onUpdateStreamTargetCompletion: (activityId: number, targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number }) => void;
  onAddSubActivity: (activityId: number, subActivity: { name: string; targetCompletion: { quarter: 1 | 2 | 3 | 4; year: number } }) => void;
  onAddAttachment: (activityId: number, file: File) => void;
  onDeleteAttachment: (activityId: number, attachmentId: string) => void;
}

const getStatusIcon = (status: Activity['status']) => {
  switch(status) {
    case "On Track":
      return <CheckCircle2 className="text-green-500" />;
    case "At Risk":
      return <AlertCircle className="text-yellow-500" />;
    case "Not Started":
      return <Clock className="text-blue-500" />;
    default:
      return <Clock className="text-blue-500" />;
  }
};

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onAddNote, 
  onEditNote,
  onDeleteNote,
  onAddIssue, 
  onEditIssue,
  onDeleteIssue,
  onToggleSubActivity,
  onUpdateProgress,
  onUpdateTargetCompletion,
  onUpdateStreamTargetCompletion,
  onAddSubActivity,
  onAddAttachment,
  onDeleteAttachment
}) => {
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: string; content: string } | null>(null);
  const [newIssue, setNewIssue] = useState<{ title: string; description: string; severity: 'Low' | 'Medium' | 'High' }>({ 
    title: '', 
    description: '', 
    severity: 'Medium' 
  });
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [newSubActivity, setNewSubActivity] = useState({ 
    name: '', 
    targetCompletion: { 
      quarter: 1 as 1 | 2 | 3 | 4, 
      year: new Date().getFullYear() 
    } 
  });
  const [showNewSubActivity, setShowNewSubActivity] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressOptions = Array.from({ length: 21 }, (_, i) => i * 5);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const quarters = [1, 2, 3, 4];

  const isSubActivityDelayed = (subActivity: SubActivity) => {
    if (!subActivity.targetCompletion || !activity.targetCompletion) return false;
    
    const streamDate = new Date(activity.targetCompletion.year, (activity.targetCompletion.quarter * 3) - 1);
    const subDate = new Date(subActivity.targetCompletion.year, (subActivity.targetCompletion.quarter * 3) - 1);
    
    return subDate > streamDate;
  };

  const hasDelayedSubActivities = activity.subActivities.some(isSubActivityDelayed);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(activity.id, newNote);
      setNewNote('');
    }
  };

  const handleAddIssue = () => {
    if (newIssue.title.trim() && newIssue.description.trim()) {
      onAddIssue(activity.id, newIssue);
      setNewIssue({ title: '', description: '', severity: 'Medium' });
    }
  };

  const handleAddSubActivity = () => {
    if (newSubActivity.name.trim()) {
      onAddSubActivity(activity.id, newSubActivity);
      setNewSubActivity({ name: '', targetCompletion: { quarter: 1, year: new Date().getFullYear() } });
      setShowNewSubActivity(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onAddAttachment(activity.id, file);
    }
  };

  return (
    <Card className={`w-full ${hasDelayedSubActivities ? 'bg-red-50' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">{activity.name}</h3>
            <p className="text-sm text-gray-500">{activity.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <select
                className="text-sm border rounded px-2 py-1"
                value={activity.targetCompletion.quarter}
                onChange={(e) => onUpdateStreamTargetCompletion(activity.id, {
                  quarter: Number(e.target.value) as 1 | 2 | 3 | 4,
                  year: activity.targetCompletion.year
                })}
              >
                {quarters.map(quarter => (
                  <option key={quarter} value={quarter}>Q{quarter}</option>
                ))}
              </select>
              <select
                className="text-sm border rounded px-2 py-1"
                value={activity.targetCompletion.year}
                onChange={(e) => onUpdateStreamTargetCompletion(activity.id, {
                  quarter: activity.targetCompletion.quarter,
                  year: Number(e.target.value)
                })}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {getStatusIcon(activity.status)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{activity.progress}%</span>
            </div>
            <Progress value={activity.progress} />
          </div>

          <div className="space-y-2">
            {activity.subActivities.map((sub, index) => (
              <div key={index} className={`flex items-center justify-between p-2 rounded ${isSubActivityDelayed(sub) ? 'bg-red-100' : ''}`}>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={sub.completed}
                    onCheckedChange={() => onToggleSubActivity(activity.id, sub.name)}
                  />
                  <span className="text-sm">
                    {sub.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    className="text-sm border rounded px-2 py-1"
                    value={sub.progress}
                    onChange={(e) => onUpdateProgress(activity.id, sub.name, Number(e.target.value))}
                  >
                    {progressOptions.map(value => (
                      <option key={value} value={value}>{value}%</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={sub.targetCompletion?.quarter || ''}
                      onChange={(e) => onUpdateTargetCompletion(activity.id, sub.name, { 
                        quarter: Number(e.target.value) as 1 | 2 | 3 | 4, 
                        year: sub.targetCompletion?.year || currentYear 
                      })}
                    >
                      {quarters.map(quarter => (
                        <option key={quarter} value={quarter}>Q{quarter}</option>
                      ))}
                    </select>
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={sub.targetCompletion?.year || ''}
                      onChange={(e) => onUpdateTargetCompletion(activity.id, sub.name, { 
                        quarter: sub.targetCompletion?.quarter || 1, 
                        year: Number(e.target.value) 
                      })}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <Progress value={sub.progress} className="w-32" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Enter your note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Issue</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Issue title"
                    className="w-full p-2 border rounded"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Describe the issue..."
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  />
                  <select
                    className="w-full p-2 border rounded"
                    value={newIssue.severity}
                    onChange={(e) => setNewIssue({ ...newIssue, severity: e.target.value as 'Low' | 'Medium' | 'High' })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <Button onClick={handleAddIssue}>Submit Issue</Button>
                </div>
              </DialogContent>
            </Dialog>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach PDF
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Sub-Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Sub-activity name"
                    className="w-full p-2 border rounded"
                    value={newSubActivity.name}
                    onChange={(e) => setNewSubActivity({ ...newSubActivity, name: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <select
                      className="w-full p-2 border rounded"
                      value={newSubActivity.targetCompletion.quarter}
                      onChange={(e) => {
                        const quarter = Number(e.target.value);
                        if (quarter >= 1 && quarter <= 4) {
                          setNewSubActivity({
                            ...newSubActivity,
                            targetCompletion: {
                              ...newSubActivity.targetCompletion,
                              quarter: quarter as 1 | 2 | 3 | 4
                            }
                          });
                        }
                      }}
                    >
                      {quarters.map(quarter => (
                        <option key={quarter} value={quarter}>Q{quarter}</option>
                      ))}
                    </select>
                    <select
                      className="w-full p-2 border rounded"
                      value={newSubActivity.targetCompletion.year}
                      onChange={(e) => setNewSubActivity({
                        ...newSubActivity,
                        targetCompletion: {
                          ...newSubActivity.targetCompletion,
                          year: Number(e.target.value)
                        }
                      })}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleAddSubActivity}>Add Sub-Activity</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {activity.attachments && activity.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Attachments</h4>
              <div className="space-y-2">
                {activity.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {attachment.name}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAttachment(activity.id, attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activity.notes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <div className="space-y-2">
                {activity.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                    {editingNote?.id === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => {
                            onEditNote(activity.id, note.id, editingNote.content);
                            setEditingNote(null);
                          }}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{note.content}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500 mt-1">
                            {note.author} - {format(new Date(note.timestamp), 'dd/MM/yyyy')}
                            {note.isEdited && ' (edited)'}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingNote({ id: note.id, content: note.content })}>
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDeleteNote(activity.id, note.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activity.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Issues</h4>
              <div className="space-y-2">
                {activity.issues.map((issue) => (
                  <div key={issue.id} className="border p-3 rounded-md">
                    {editingIssue?.id === issue.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={editingIssue.title}
                          onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                        />
                        <Textarea
                          value={editingIssue.description}
                          onChange={(e) => setEditingIssue({ ...editingIssue, description: e.target.value })}
                        />
                        <select
                          className="w-full p-2 border rounded"
                          value={editingIssue.severity}
                          onChange={(e) => setEditingIssue({ ...editingIssue, severity: e.target.value as 'Low' | 'Medium' | 'High' })}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <div className="flex gap-2">
                          <Button onClick={() => {
                            onEditIssue(activity.id, issue.id, {
                              title: editingIssue.title,
                              description: editingIssue.description,
                              severity: editingIssue.severity
                            });
                            setEditingIssue(null);
                          }}>Save</Button>
                          <Button variant="outline" onClick={() => setEditingIssue(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{issue.title}</h5>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.severity}
                            </span>
                            <Button size="sm" variant="outline" onClick={() => setEditingIssue(issue)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDeleteIssue(activity.id, issue.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm mt-1">{issue.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {issue.author} - {format(new Date(issue.timestamp), 'dd/MM/yyyy')}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
