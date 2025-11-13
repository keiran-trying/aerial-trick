# Aerial Trick App - Setup Instructions

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Get an OpenAI API key at https://platform.openai.com

## Environment Variables
Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Supabase Database Setup
Run the SQL script in `supabase/schema.sql` in your Supabase SQL editor to create all necessary tables.

## Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

