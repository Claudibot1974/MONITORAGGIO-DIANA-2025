// Global state
let currentData = JSON.parse(JSON.stringify(initialData));

// Utility functions
const generateQuarterOptions = (startYear = 2025, endYear = 2026) => {
    let options = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let quarter = 1; quarter <= 4; quarter++) {
            options.push(`Q${quarter}-${year}`);
        }
    }
    return options;
};

const generateProgressOptions = () => {
    let options = [];
    for (let i = 0; i <= 100; i += 5) {
        options.push(i);
    }
    return options;
};

const isDelayed = (activity, streamEndQuarter) => {
    if (!activity.endQuarter || !streamEndQuarter) return false;
    
    const [actQ, actY] = activity.endQuarter.split('-');
    const [streamQ, streamY] = streamEndQuarter.split('-');
    
    if (parseInt(actY) > parseInt(streamY)) return true;
    if (parseInt(actY) < parseInt(streamY)) return false;
    
    return parseInt(actQ.slice(1)) > parseInt(streamQ.slice(1));
};

const calculateProgress = (activity) => {
    if (!activity.endQuarter || !activity.startQuarter) return 0;
    
    const now = new Date();
    const [startQ, startY] = activity.startQuarter.split('-');
    const [endQ, endY] = activity.endQuarter.split('-');
    
    const startDate = new Date(startY, (parseInt(startQ.slice(1)) - 1) * 3, 1);
    const endDate = new Date(endY, (parseInt(endQ.slice(1)) - 1) * 3 + 3, 0);
    
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    
    return Math.round((elapsed / totalDuration) * 100);
};

// DOM manipulation functions
const renderStream = (stream) => {
    const streamDiv = document.createElement('div');
    streamDiv.className = 'stream';
    streamDiv.id = stream.id;
    
    const isStreamDelayed = stream.activities.some(act => isDelayed(act, stream.endQuarter));
    
    streamDiv.innerHTML = `
        <div class="stream-header" style="background-color: ${isStreamDelayed ? 'var(--danger-color)' : 'var(--primary-color)'}">
            <h2>${stream.name}</h2>
            <div class="stream-controls">
                <select class="quarter-select" data-type="stream-end">
                    <option value="">End Quarter</option>
                    ${generateQuarterOptions().map(q => 
                        `<option value="${q}" ${q === stream.endQuarter ? 'selected' : ''}>${q}</option>`
                    ).join('')}
                </select>
                <button class="btn add-activity" data-stream="${stream.id}">
                    <i class="fas fa-plus"></i> Add Activity
                </button>
            </div>
        </div>
        <div class="stream-content">
            ${stream.activities.map(activity => renderActivity(activity, stream.endQuarter)).join('')}
        </div>
    `;
    
    return streamDiv;
};

const renderActivity = (activity, streamEndQuarter) => {
    const delayed = isDelayed(activity, streamEndQuarter);
    const expectedProgress = calculateProgress(activity);
    const behind = activity.progress < expectedProgress;
    
    return `
        <div class="activity ${delayed ? 'delayed' : ''}" id="${activity.id}">
            <div class="activity-header">
                <span class="activity-title" style="color: ${behind ? 'var(--danger-color)' : 'var(--success-color)'}">
                    ${activity.name}
                </span>
                <div class="activity-controls">
                    <select class="quarter-select" data-type="start">
                        <option value="">Start Quarter</option>
                        ${generateQuarterOptions().map(q => 
                            `<option value="${q}" ${q === activity.startQuarter ? 'selected' : ''}>${q}</option>`
                        ).join('')}
                    </select>
                    <select class="quarter-select" data-type="end">
                        <option value="">End Quarter</option>
                        ${generateQuarterOptions().map(q => 
                            `<option value="${q}" ${q === activity.endQuarter ? 'selected' : ''}>${q}</option>`
                        ).join('')}
                    </select>
                    <select class="progress-select">
                        ${generateProgressOptions().map(p => 
                            `<option value="${p}" ${p === activity.progress ? 'selected' : ''}>${p}%</option>`
                        ).join('')}
                    </select>
                    <input type="file" accept=".pdf" class="file-upload" style="display: none;">
                    <button class="btn" onclick="this.previousElementSibling.click()">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                </div>
            </div>
            <div class="notes-issues">
                <div class="notes">
                    <h4>Notes</h4>
                    ${activity.notes.map((note, index) => `
                        <div class="note-item">
                            <span>${note}</span>
                            <div>
                                <i class="fas fa-edit edit-btn" data-type="note" data-index="${index}"></i>
                                <i class="fas fa-trash delete-btn" data-type="note" data-index="${index}"></i>
                            </div>
                        </div>
                    `).join('')}
                    <button class="btn add-note">Add Note</button>
                </div>
                <div class="issues">
                    <h4>Issues</h4>
                    ${activity.issues.map((issue, index) => `
                        <div class="issue-item">
                            <span>${issue}</span>
                            <div>
                                <i class="fas fa-edit edit-btn" data-type="issue" data-index="${index}"></i>
                                <i class="fas fa-trash delete-btn" data-type="issue" data-index="${index}"></i>
                            </div>
                        </div>
                    `).join('')}
                    <button class="btn add-issue">Report Issue</button>
                </div>
                ${activity.documents.length > 0 ? `
                    <div class="documents">
                        <h4>Documents</h4>
                        ${activity.documents.map(doc => `
                            <div class="document-item">
                                <a href="${doc.url}" target="_blank">${doc.name}</a>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
};

// Event handlers
const setupEventListeners = () => {
    const projectStreams = document.getElementById('projectStreams');
    
    // Stream and activity events
    projectStreams.addEventListener('change', (e) => {
        const target = e.target;
        if (target.classList.contains('quarter-select')) {
            handleQuarterChange(target);
        } else if (target.classList.contains('progress-select')) {
            handleProgressChange(target);
        }
    });
    
    // Note and issue events
    projectStreams.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('add-note')) {
            handleAddNote(target);
        } else if (target.classList.contains('add-issue')) {
            handleAddIssue(target);
        } else if (target.classList.contains('edit-btn')) {
            handleEdit(target);
        } else if (target.classList.contains('delete-btn')) {
            handleDelete(target);
        }
    });
    
    // File upload events
    projectStreams.addEventListener('change', (e) => {
        const target = e.target;
        if (target.classList.contains('file-upload')) {
            handleFileUpload(target);
        }
    });
    
    // Global actions
    document.getElementById('generateReport').addEventListener('click', generateReport);
    document.getElementById('saveState').addEventListener('click', saveState);
    document.getElementById('loadState').addEventListener('click', loadState);
    document.getElementById('addStream').addEventListener('click', showAddStreamModal);
    
    // Modal events
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
};

// Event handler implementations
const handleQuarterChange = (select) => {
    const activity = select.closest('.activity');
    const stream = select.closest('.stream');
    
    if (activity) {
        const activityId = activity.id;
        const streamId = stream.id;
        const type = select.dataset.type;
        const value = select.value;
        
        const streamData = currentData.streams.find(s => s.id === streamId);
        const activityData = streamData.activities.find(a => a.id === activityId);
        
        if (type === 'start') {
            activityData.startQuarter = value;
        } else if (type === 'end') {
            activityData.endQuarter = value;
        }
    } else if (stream && select.dataset.type === 'stream-end') {
        const streamId = stream.id;
        const streamData = currentData.streams.find(s => s.id === streamId);
        streamData.endQuarter = select.value;
    }
    
    renderAllStreams();
};

const handleProgressChange = (select) => {
    const activity = select.closest('.activity');
    const stream = select.closest('.stream');
    const activityId = activity.id;
    const streamId = stream.id;
    
    const streamData = currentData.streams.find(s => s.id === streamId);
    const activityData = streamData.activities.find(a => a.id === activityId);
    
    activityData.progress = parseInt(select.value);
    renderAllStreams();
};

const handleAddNote = (button) => {
    const modal = document.getElementById('noteModal');
    const activity = button.closest('.activity');
    const stream = button.closest('.stream');
    
    modal.dataset.activityId = activity.id;
    modal.dataset.streamId = stream.id;
    modal.dataset.type = 'note';
    modal.style.display = 'block';
    
    document.getElementById('noteText').value = '';
};

const handleAddIssue = (button) => {
    const modal = document.getElementById('issueModal');
    const activity = button.closest('.activity');
    const stream = button.closest('.stream');
    
    modal.dataset.activityId = activity.id;
    modal.dataset.streamId = stream.id;
    modal.style.display = 'block';
    
    document.getElementById('issueText').value = '';
};

const handleEdit = (button) => {
    const type = button.dataset.type;
    const index = parseInt(button.dataset.index);
    const activity = button.closest('.activity');
    const stream = button.closest('.stream');
    
    const modal = document.getElementById(type === 'note' ? 'noteModal' : 'issueModal');
    const textarea = modal.querySelector('textarea');
    
    const streamData = currentData.streams.find(s => s.id === stream.id);
    const activityData = streamData.activities.find(a => a.id === activity.id);
    
    textarea.value = type === 'note' ? activityData.notes[index] : activityData.issues[index];
    
    modal.dataset.activityId = activity.id;
    modal.dataset.streamId = stream.id;
    modal.dataset.type = type;
    modal.dataset.index = index;
    modal.style.display = 'block';
};

const handleDelete = (button) => {
    const type = button.dataset.type;
    const index = parseInt(button.dataset.index);
    const activity = button.closest('.activity');
    const stream = button.closest('.stream');
    
    const streamData = currentData.streams.find(s => s.id === stream.id);
    const activityData = streamData.activities.find(a => a.id === activity.id);
    
    if (type === 'note') {
        activityData.notes.splice(index, 1);
    } else {
        activityData.issues.splice(index, 1);
    }
    
    renderAllStreams();
};

const handleFileUpload = async (input) => {
    const file = input.files[0];
    if (!file) return;
    
    const activity = input.closest('.activity');
    const stream = input.closest('.stream');
    
    const streamData = currentData.streams.find(s => s.id === stream.id);
    const activityData = streamData.activities.find(a => a.id === activity.id);
    
    // In a real application, you would upload the file to a server
    // Here we'll just store it as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
        activityData.documents.push({
            name: file.name,
            url: e.target.result
        });
        renderAllStreams();
    };
    reader.readAsDataURL(file);
};

const generateReport = () => {
    const report = {
        date: new Date().toISOString(),
        streams: currentData.streams.map(stream => ({
            name: stream.name,
            endQuarter: stream.endQuarter,
            activities: stream.activities.map(activity => ({
                name: activity.name,
                progress: activity.progress,
                startQuarter: activity.startQuarter,
                endQuarter: activity.endQuarter,
                delayed: isDelayed(activity, stream.endQuarter),
                notes: activity.notes,
                issues: activity.issues
            }))
        }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diana-goals-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const saveState = () => {
    localStorage.setItem('dianaGoalsState', JSON.stringify(currentData));
    alert('State saved successfully!');
};

const loadState = () => {
    const savedState = localStorage.getItem('dianaGoalsState');
    if (savedState) {
        currentData = JSON.parse(savedState);
        renderAllStreams();
        alert('State loaded successfully!');
    } else {
        alert('No saved state found!');
    }
};

const showAddStreamModal = () => {
    const modal = document.getElementById('streamModal');
    modal.style.display = 'block';
};

const renderAllStreams = () => {
    const projectStreams = document.getElementById('projectStreams');
    projectStreams.innerHTML = '';
    currentData.streams.forEach(stream => {
        projectStreams.appendChild(renderStream(stream));
    });
};

// Modal save handlers
document.getElementById('saveNote').addEventListener('click', () => {
    const modal = document.getElementById('noteModal');
    const text = document.getElementById('noteText').value.trim();
    
    if (!text) return;
    
    const streamId = modal.dataset.streamId;
    const activityId = modal.dataset.activityId;
    const index = modal.dataset.index;
    
    const streamData = currentData.streams.find(s => s.id === streamId);
    const activityData = streamData.activities.find(a => a.id === activityId);
    
    if (index !== undefined) {
        activityData.notes[index] = text;
    } else {
        activityData.notes.push(text);
    }
    
    modal.style.display = 'none';
    renderAllStreams();
});

document.getElementById('saveIssue').addEventListener('click', () => {
    const modal = document.getElementById('issueModal');
    const text = document.getElementById('issueText').value.trim();
    
    if (!text) return;
    
    const streamId = modal.dataset.streamId;
    const activityId = modal.dataset.activityId;
    const index = modal.dataset.index;
    
    const streamData = currentData.streams.find(s => s.id === streamId);
    const activityData = streamData.activities.find(a => a.id === activityId);
    
    if (index !== undefined) {
        activityData.issues[index] = text;
    } else {
        activityData.issues.push(text);
    }
    
    modal.style.display = 'none';
    renderAllStreams();
});

document.getElementById('saveStream').addEventListener('click', () => {
    const name = document.getElementById('streamName').value.trim();
    const endQuarter = document.getElementById('streamEndQuarter').value;
    
    if (!name || !endQuarter) return;
    
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    currentData.streams.push({
        id,
        name,
        endQuarter,
        activities: []
    });
    
    document.getElementById('streamModal').style.display = 'none';
    document.getElementById('streamName').value = '';
    document.getElementById('streamEndQuarter').value = '';
    
    renderAllStreams();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderAllStreams();
});
