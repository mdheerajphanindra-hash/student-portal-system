// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// --- Helper: initialize defaults if missing
let db = loadData();
db.student = db.student || {
  name: "Syed Nagul Meera",
  roll: "RA2111029010001",
  branch: "Computer Science Engineering",
  shortBranch: "CSE",
  year: 2,
  email: "john.doe@example.com",
  phone: "+91 90000 00000"
};
db.subjects = db.subjects || [
  { code: "CS201", name: "Data Structures", credits: 4 },
  { code: "CS202", name: "Database Systems", credits: 4 },
  { code: "MA201", name: "Mathematics III", credits: 3 },
  { code: "CS203", name: "Operating Systems", credits: 4 },
  { code: "CS204", name: "Python Programming", credits: 3 },
  { code: "HS201", name: "Communicative English", credits: 2 }
];
db.registered = db.registered || ["CS201", "CS204", "MA201"];
db.timetable = db.timetable || [
  { day: "Monday", slots: ["Data Structures", "Database Systems", "Lunch", "Python Programming"] },
  { day: "Tuesday", slots: ["Mathematics III", "Operating Systems", "Lunch", "Data Structures"] },
  { day: "Wednesday", slots: ["Python Programming", "Database Systems", "Lunch", "Operating Systems"] },
  { day: "Thursday", slots: ["Mathematics III", "Data Structures", "Lunch", "HS: English"] },
  { day: "Friday", slots: ["Operating Systems", "Python Programming", "Lunch", "Database Systems"] }
];
db.marks = db.marks || [
  { code: "CS201", name: "Data Structures", max: 100, score: 90 },
  { code: "CS202", name: "Database Systems", max: 100, score: 84 },
  { code: "MA201", name: "Mathematics III", max: 100, score: 88 },
  { code: "CS203", name: "Operating Systems", max: 100, score: 82 },
  { code: "CS204", name: "Python Programming", max: 100, score: 93 },
  { code: "HS201", name: "Communicative English", max: 100, score: 78 }
];
db.attendance = db.attendance || [
  { code: "CS201", attended: 42, total: 45 },
  { code: "CS202", attended: 40, total: 45 },
  { code: "MA201", attended: 44, total: 46 },
  { code: "CS203", attended: 41, total: 45 },
  { code: "CS204", attended: 45, total: 48 },
  { code: "HS201", attended: 43, total: 45 }
];
db.fees = db.fees || [
  { part: "Tuition Fee", amount: 150000, paid: 150000 },
  { part: "Exam Fee", amount: 2000, paid: 0 },
  { part: "Hostel Fee", amount: 30000, paid: 30000 },
  { part: "Library Fine", amount: 500, paid: 0 }
];
db.exams = db.exams || [
  { date: "2025-12-12", time: "09:00 - 12:00", subject: "Data Structures", venue: "Exam Hall A" },
  { date: "2025-12-14", time: "09:00 - 12:00", subject: "Python Programming", venue: "Exam Hall B" },
  { date: "2025-12-16", time: "09:00 - 12:00", subject: "Mathematics III", venue: "Exam Hall A" }
];
db.announcements = db.announcements || [
  "Mid-term exams start from 12th December.",
  "Assignment 2 submission deadline: 10th December.",
  "Guest lecture on AI: 8th December."
];
db.notifications = db.notifications || [
  { time: "2025-11-30", text: "Library will remain closed on 6th Dec due to maintenance." },
  { time: "2025-11-28", text: "Sports day registration open." }
];
db.feedback = db.feedback || [];

saveData(db);

// --- Routes ---
// GET all data (small demo)
app.get('/api/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Student
app.get('/api/student', (req, res) => res.json(loadData().student));
app.put('/api/student', (req, res) => {
  const data = loadData();
  data.student = Object.assign({}, data.student, req.body);
  saveData(data);
  res.json(data.student);
});

// Subjects
app.get('/api/subjects', (req, res) => res.json(loadData().subjects));

// Registered courses (manage)
app.get('/api/registered', (req, res) => res.json(loadData().registered));
app.post('/api/registered', (req, res) => {
  const { code } = req.body;
  const data = loadData();
  if (!code) return res.status(400).json({ error: 'code required' });
  if (!data.registered.includes(code)) {
    data.registered.push(code);
    saveData(data);
  }
  res.json(data.registered);
});
app.delete('/api/registered/:code', (req, res) => {
  const code = req.params.code;
  const data = loadData();
  data.registered = data.registered.filter(c => c !== code);
  saveData(data);
  res.json(data.registered);
});

// Marks
app.get('/api/marks', (req, res) => res.json(loadData().marks));
app.put('/api/marks', (req, res) => {
  const data = loadData();
  data.marks = req.body.marks || data.marks;
  saveData(data);
  res.json(data.marks);
});

// Attendance
app.get('/api/attendance', (req, res) => res.json(loadData().attendance));
app.put('/api/attendance', (req, res) => {
  const data = loadData();
  data.attendance = req.body.attendance || data.attendance;
  saveData(data);
  res.json(data.attendance);
});

// Fees
app.get('/api/fees', (req, res) => res.json(loadData().fees));
app.put('/api/fees', (req, res) => {
  const data = loadData();
  data.fees = req.body.fees || data.fees;
  saveData(data);
  res.json(data.fees);
});

// Exams
app.get('/api/exams', (req, res) => res.json(loadData().exams));
app.post('/api/exams', (req, res) => {
  const data = loadData();
  data.exams.push(req.body);
  saveData(data);
  res.status(201).json(data.exams);
});

// Announcements
app.get('/api/announcements', (req, res) => res.json(loadData().announcements));
app.post('/api/announcements', (req, res) => {
  const data = loadData();
  if (req.body.text) {
    data.announcements.unshift(req.body.text);
    saveData(data);
  }
  res.json(data.announcements);
});

// Notifications
app.get('/api/notifications', (req, res) => res.json(loadData().notifications));
app.post('/api/notifications', (req, res) => {
  const data = loadData();
  const dt = new Date().toISOString().slice(0, 10);
  if (req.body.text) {
    data.notifications.unshift({ time: dt, text: req.body.text });
    saveData(data);
  }
  res.json(data.notifications);
});
app.delete('/api/notifications', (req, res) => {
  // expects body: { time: '2025-11-30', text: '...' }
  const data = loadData();
  if (req.body && req.body.time && req.body.text) {
    data.notifications = data.notifications.filter(n => !(n.time === req.body.time && n.text === req.body.text));
    saveData(data);
  }
  res.json(data.notifications);
});

// Feedback
app.post('/api/feedback', (req, res) => {
  const data = loadData();
  const fb = req.body; // { type, message, date }
  if (fb) {
    data.feedback.push(fb);
    saveData(data);
  }
  res.json({ success: true });
});

// Simple health check
app.get('/', (req, res) => res.send('SRM demo API running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
