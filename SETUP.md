# Telegram Mini App Setup — Пошаговая инструкция

## Status
- Bot Token: ✅ **Получен** (`<BOT_TOKEN>`)
- Bot Name: ✅ **Готов** (`architect-sadikov`)
- Mini App: ✅ **Создано** (`miniapp-dashboard`)
- .env настроен: ✅ **Готово**

---

## ШАГ 1: Локальный запуск (5 минут)

```bash
# 1. Перейти в папку
cd F:/UNICAP/projects/miniapp-dashboard

# 2. Установить зависимости
npm install

# 3. Запустить dev сервер
npm run dev

# 4. Открыть в браузере
# http://localhost:3000
```

**Что видите:**
- Главная страница с 4 табами: Обзор, Очередь, Отправить, Аналитика
- Демо-статистика (реальные данные из Supabase когда подключите)

---

## ШАГ 2: Настроить Supabase интеграцию (10 минут)

### 2.1 Создать Supabase проект

1. Перейти на https://supabase.com/
2. Sign in / Create account
3. New project
4. Name: `unicap-sales`
5. Database password: *сохранить*
6. Region: `eu-west-1` (Europe)
7. Создать проект

### 2.2 Получить credentials

1. В Supabase → Settings → API
2. Copy: `Project URL` 
3. Copy: `anon key` (public)
4. Вставить в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key...
```

### 2.3 Создать таблицы

В Supabase → SQL Editor → New query:

```sql
-- 1. Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id TEXT DEFAULT 'active',
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  linkedin_url TEXT,
  confidence_score FLOAT DEFAULT 0.5,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Campaign messages
CREATE TABLE campaign_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id TEXT DEFAULT 'active',
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  template_id TEXT,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP
);

-- 3. Campaign stats (real-time)
CREATE TABLE campaign_stats (
  campaign_id TEXT PRIMARY KEY,
  total_contacts INT DEFAULT 0,
  queued INT DEFAULT 0,
  sent INT DEFAULT 0,
  opened INT DEFAULT 0,
  clicked INT DEFAULT 0,
  engaged INT DEFAULT 0,
  response_rate FLOAT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Manual outreach log
CREATE TABLE manual_outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_company TEXT,
  template_id TEXT,
  message TEXT,
  sent_by TEXT,
  sent_at TIMESTAMP DEFAULT now(),
  status TEXT DEFAULT 'logged'
);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_outreach ENABLE ROW LEVEL SECURITY;

-- Create public policies (for MVP)
CREATE POLICY "Allow public read" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON contacts FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON campaign_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON campaign_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON campaign_stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON campaign_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON campaign_stats FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON manual_outreach FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON manual_outreach FOR SELECT USING (true);
```

### 2.4 Вставить тестовые данные

```sql
-- Insert sample stats
INSERT INTO campaign_stats (campaign_id, total_contacts, queued, sent, engaged, response_rate)
VALUES ('active', 300, 45, 120, 32, 26.7);

-- Insert sample contacts
INSERT INTO contacts (campaign_id, name, email, company, industry, confidence_score, status)
VALUES 
  ('active', 'John Smith', 'john@techcorp.com', 'TechCorp', 'Technology', 0.92, 'queued'),
  ('active', 'Sarah Johnson', 'sarah@realtyco.com', 'Realty Co', 'Real Estate', 0.87, 'queued'),
  ('active', 'Mike Chen', 'mike@fintech.io', 'FinTech Inc', 'Finance', 0.95, 'sent');
```

---

## ШАГ 3: Подключить парсер контактов (5 минут)

```bash
# Запустить парсер в отдельном терминале
cd F:/UNICAP/data/autopars
python run.py

# Результат: companies_qualified.json → contacts в Supabase
```

---

## ШАГ 4: Развернуть на Vercel (10 минут)

### 4.1 Подготовить к деплою

```bash
cd F:/UNICAP/projects/miniapp-dashboard

# Проверить сборку
npm run build

# Должно быть успешно без ошибок
```

### 4.2 Разместить на Vercel

**Вариант 1: CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Вариант 2: GitHub**
1. Git push на GitHub
2. Vercel → Import project → Select repo
3. Environment variables: вставить `.env.local` переменные
4. Deploy

### 4.3 Записать URL

Vercel даст URL типа:
```
https://miniapp-dashboard-timur.vercel.app
```

Сохранить этот URL (нужен для Telegram).

---

## ШАГ 5: Интегрировать с Telegram ботом (5 минут)

### 5.1 Настроить меню бота

```bash
# Через BotFather в Telegram, отправить:
/setcommands
```

Затем скопировать эту текст:
```
dashboard - Open UNICAP Sales Dashboard
help - Get help
settings - Bot settings
```

### 5.2 Настроить webpages (через API)

```bash
# Установить curl или использовать Postman

curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://miniapp-dashboard-timur.vercel.app/api/telegram",
    "allowed_updates": ["message", "callback_query"]
  }'

# Проверить результат
curl https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

### 5.3 Протестировать в Telegram

1. Открыть Telegram
2. Найти `@architect-sadikov`
3. Тап на кнопку меню
4. `/dashboard` → должен открыться Mini App
5. Проверить что загружаются статы

---

## ШАГ 6: Интегрировать с парсером (10 минут)

### 6.1 Настроить автозапуск парсера

```bash
# В F:/UNICAP/data/autopars/run.py добавить в конец:

from datetime import datetime
import time

while True:
    print(f"[{datetime.now()}] Running parser...")
    
    # 1. Parse LinkedIn + Yandex Maps
    companies_raw = parse_all_sources()
    
    # 2. Filter & score
    companies_qualified = filter_and_score(companies_raw)
    
    # 3. Upload to Supabase
    upload_to_supabase(companies_qualified)
    
    # 4. Update campaign_stats
    update_campaign_stats()
    
    # Sleep for 1 hour
    time.sleep(3600)
```

### 6.2 Запустить в фоне

```bash
# Linux/Mac
nohup python run.py > parser.log 2>&1 &

# Windows (в отдельной консоли)
python run.py

# Или использовать systemd/supervisor для production
```

---

## ШАГ 7: Настроить email/SMS/Telegram рассылку (15 минут)

### 7.1 Supabase Functions для автоотправки

```bash
# Создать функцию (Edge Function)
supabase functions new send-campaign

# В function добавить:
# - Email (SendGrid)
# - SMS (Twilio)
# - Telegram (Bot API)
# - Webhook trigger на новые контакты
```

### 7.2 Активировать real-time triggers

В Supabase → Database → Replication:
- Enable replication на `contacts` и `campaign_stats`
- Min-max Wal level: 100 MB (default OK)

---

## ШАГ 8: Мониторинг и аналитика (5 минут)

### 8.1 Включить аналитику

```env
# В Supabase → Settings → Logs
# Enable query stats
# Enable event log
```

### 8.2 Настроить alerts

```bash
# В Mini App → Analytics → Recommendations:
# - Alert когда конверсия < 5%
# - Alert когда queue пуста
# - Daily digest в 8 AM UTC
```

---

## Финальный Чеклист

- [ ] Supabase проект создан
- [ ] Таблицы созданы и заполнены тестовыми данными
- [ ] Mini App запущено локально (http://localhost:3000)
- [ ] Deployed на Vercel (имеете URL)
- [ ] Telegram бот создан и настроен
- [ ] Webhook установлен
- [ ] `/dashboard` открывается в Telegram
- [ ] Реальные данные загружаются из Supabase
- [ ] Парсер запущен и загружает контакты
- [ ] Statistika обновляются в real-time

---

## Команды для быстрого запуска

```bash
# Dev
cd F:/UNICAP/projects/miniapp-dashboard && npm run dev

# Build
npm run build

# Deploy
npm run deploy

# Check build
npm run build && npm start

# Parser
cd F:/UNICAP/data/autopars && python run.py
```

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Mini App not opening in Telegram
1. Check bot token in .env
2. Verify webhook is set
3. Check Vercel deployment URL
4. Test manually: open bot and type `/dashboard`

### Stats not updating
1. Check Supabase connection
2. Verify RLS policies allow reads
3. Test query: `SELECT * FROM campaign_stats;` in Supabase
4. Check browser console for errors

### Parser not uploading to Supabase
1. Verify Supabase credentials
2. Check contacts table exists
3. Test insert: `INSERT INTO contacts VALUES (...)`
4. Check parser logs: `tail -f parser.log`

---

## What's Next?

1. **Complete Bot Deployment**: Deploy `UNICAPgroup/bot-sales` to production
2. **Enable Email/SMS**: Configure SendGrid + Twilio
3. **Setup CI/CD**: GitHub Actions for auto-deploy on changes
4. **Monitor Performance**: Set up PostHog analytics
5. **Scale Outreach**: Increase parser targets, add more channels

---

**Timeline to Production:**
- Today (Step 1-5): 30 minutes
- Tomorrow (Step 6-8): 1-2 hours
- Week 1: Full automation + monitoring
- Week 2: Scale to 1000+ contacts

**Status:** 🟢 Ready to Launch!
