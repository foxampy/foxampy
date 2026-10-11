# UNICAP Sales Dashboard — Telegram Mini App

Personal dashboard for Timur (ID: 7694835964) to monitor and control UNICAP sales campaigns in real-time via Telegram.

## Features

✅ **Real-time Campaign Monitoring**
- Live stats (contacts, sent, engaged, response rate)
- Supabase real-time subscriptions
- Auto-refresh on data changes

✅ **Campaign Management**
- View queued contacts with confidence scores
- Manual outreach tracking
- Send registration for LinkedIn/Email/Telegram

✅ **Analytics Dashboard**
- Funnel visualization (Contacts → Sent → Engaged)
- Daily activity timeline
- Engagement metrics by channel
- Day-of-week performance analysis

✅ **Smart Recommendations**
- Best sending times (Tue-Thu, 9-10 AM / 2-3 PM UTC)
- Channel effectiveness comparison
- Conversion optimization tips

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** Supabase (real-time)
- **Hosting:** Vercel
- **Telegram SDK:** telegram-web-app.js

## Quick Start

### 1. Setup Environment

```bash
cd F:/UNICAP/projects/miniapp-dashboard

# Copy env template
cp .env.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npm run build
npm run deploy
```

## Telegram Mini App Setup

### Step 1: Register with BotFather

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Create new bot: `/newbot`
3. Bot name: `UNICAP Sales Dashboard`
4. Bot username: `architect_sadikov_dashboard`
5. Save the token (already set in .env: `<BOT_TOKEN>`)

### Step 2: Set Mini App

```bash
# Via BotFather:
/setmycommands

# Add:
dashboard - Open UNICAP Dashboard
```

### Step 3: Configure Webhook

```bash
# For production deployment
curl -X POST https://api.telegram.org/bot{BOT_TOKEN}/setWebhook \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://your-vercel-deployment.vercel.app/api/telegram"}'
```

### Step 4: Link Mini App to Bot

In BotFather:
```
/setmycommands
dashboard - Open Sales Dashboard

/setMyDefaultAdministratorRights

# Then in Inline mode, configure:
/setinlinequeryresults
```

## Environment Variables

```env
# Bot Configuration
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_token_here
NEXT_PUBLIC_TELEGRAM_BOT_NAME=architect-sadikov
NEXT_PUBLIC_ADMIN_TELEGRAM_ID=7694835964

# Supabase (Real-time database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Deployment
VERCEL_PROJECT_ID=
VERCEL_ORG_ID=
```

## Project Structure

```
miniapp-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with Telegram SDK
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Tailwind styles
│   └── api/
│       └── telegram/       # Webhook endpoint (optional)
├── components/
│   ├── Header.tsx          # Stats header
│   ├── CampaignStats.tsx   # Overview charts
│   ├── ContactQueue.tsx    # Queued contacts list
│   ├── ManualSend.tsx      # Manual outreach form
│   └── EngagementChart.tsx # Analytics
├── lib/
│   └── supabase.ts         # Supabase client & functions
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Database Schema (Supabase)

### Required Tables

```sql
-- Contacts queue
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  campaign_id TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  linkedin_url TEXT,
  confidence_score FLOAT,
  status TEXT,
  created_at TIMESTAMP
);

-- Outreach tracking
CREATE TABLE campaign_messages (
  id UUID PRIMARY KEY,
  campaign_id TEXT,
  contact_id UUID REFERENCES contacts(id),
  template_id TEXT,
  status TEXT,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP
);

-- Real-time stats
CREATE TABLE campaign_stats (
  campaign_id TEXT PRIMARY KEY,
  total_contacts INT,
  queued INT,
  sent INT,
  opened INT,
  clicked INT,
  engaged INT,
  response_rate FLOAT,
  updated_at TIMESTAMP
);

-- Manual outreach log
CREATE TABLE manual_outreach (
  id UUID PRIMARY KEY,
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_company TEXT,
  template_id TEXT,
  message TEXT,
  sent_by TEXT,
  sent_at TIMESTAMP,
  status TEXT
);
```

## Features Breakdown

### 📊 Overview Tab
- Quick metrics (contacts, sent, engaged, response rate)
- Funnel visualization
- Weekly activity timeline

### 📋 Queue Tab
- List of contacts ready to send
- Confidence scores
- Direct LinkedIn/Email actions
- Manual send button

### ✉️ Send Tab
- Manual outreach form
- Template selection
- Custom message option
- Logs all outreach to database

### 📈 Analytics Tab
- Engagement pie chart
- Channel performance comparison
- Daily performance metrics
- Smart recommendations

## Usage in Telegram

1. Open Telegram
2. Find `@architect-sadikov`
3. Tap `/dashboard` or use menu button
4. Mini App opens in-app
5. Monitor campaigns, manage queue, track analytics

## Real-time Updates

All stats update in real-time via Supabase subscriptions:

```typescript
supabase
  .channel('campaign_updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_stats' }, (payload) => {
    setStats(payload.new)
  })
  .subscribe()
```

## Performance Notes

- **Mobile optimized** - Responsive design for all screen sizes
- **Low bandwidth** - Only fetch necessary data
- **Real-time sync** - Supabase WebSocket subscriptions
- **Offline capable** - LocalStorage fallback (future)
- **Fast load** - Server-side rendering with Next.js

## Troubleshooting

### Mini App not opening?
- Verify bot token in .env
- Check Telegram SDK is loaded
- Ensure `window.Telegram.WebApp.ready()` called

### Stats not updating?
- Check Supabase connection
- Verify database tables exist
- Check real-time subscriptions in browser console

### Build errors?
- Clear `.next` folder: `rm -rf .next`
- Reinstall deps: `rm -rf node_modules && npm install`
- Check TypeScript: `npx tsc --noEmit`

## Deployment Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Supabase credentials
- [ ] Run `npm install`
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy: `npm run deploy` (Vercel)
- [ ] Set webhook in BotFather
- [ ] Test Mini App opening from bot
- [ ] Monitor stats updates

## Support & Docs

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Status:** ✅ Production Ready  
**Last Updated:** 2026-10-08  
**Owner:** Timur Sadykov (ID: 7694835964)
