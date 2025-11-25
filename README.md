# 🧘‍♀️ Aerial Tricks - Aerial Yoga Learning Platform

A beautiful, modern mobile-first web application for learning aerial yoga. Track your progress, connect with the community, and master aerial yoga tricks at your own pace.

## ✨ Features

### 🏠 Home & Daily Trick
- **Daily Trick**: A new randomly selected tutorial every day at midnight
- **Difficulty Levels**: Easy, Intermediate, Advanced, and Drop
- **Favorites System**: Save your favorite tutorials for quick access
- **Smart Organization**: Tutorials organized by difficulty with favorites section

### 👥 Community
- **Social Feed**: Share photos and videos of your practice
- **Q&A**: Ask questions and help others
- **Interactions**: Like and comment on community posts
- **Real-time Updates**: See the latest posts from the community

### 📊 Progress Tracking
- **Comprehensive Stats**: Track minutes practiced, videos completed, days practiced, and current streak
- **Points System**: Earn points based on tutorial difficulty and duration
- **Achievements**: Unlock badges for milestones (First Flight, Week Warrior, etc.)
- **Progress Photos**: Upload photos at key milestones (Day 1, 1 month, 3 months, 6 months, 1 year)
- **Visual Transformation**: Compare your progress over time

### ⭐ Favorites
- Dedicated tab for all your favorite tutorials
- One-tap access to tutorials you love
- Synced across sessions

### 👤 Profile
- View and edit your profile
- See your complete stats summary
- Access admin portal
- Secure logout

### 🔧 Admin Portal
- Upload tutorial videos with auto-thumbnail generation
- Add tutorial metadata (title, description, difficulty, duration, collection)
- Edit and delete existing tutorials
- Drag-and-drop file uploads

### 🎯 Smart Features
- **Auto-thumbnail**: Automatically generates thumbnails from uploaded videos
- **Points System**: Dynamic points based on difficulty and duration
- **Streak Tracking**: Maintains practice streaks with daily check-ins
- **Motivational Messages**: AI-generated encouragement after completing tutorials
- **Video Comments**: Engage with tutorials through comments

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-3.5
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional, has fallback)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd aerial-trick
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Set up Storage Buckets (see `supabase/storage-buckets.md`):
   - tutorials (public)
   - posts (public)
   - progress-photos (public)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration (optional - has fallback messages)
OPENAI_API_KEY=your_openai_api_key

# Optional: Cron job security
CRON_SECRET=your_random_secret_string
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Users

1. **Sign Up**: Create an account at `/auth/login`
2. **Browse Tutorials**: Explore tutorials by difficulty level
3. **Watch & Learn**: Complete tutorials to earn points and track progress
4. **Connect**: Share your practice and engage with the community
5. **Track Progress**: Upload progress photos and view your stats

### For Admins

1. Navigate to **Profile → Admin Portal**
2. Click **Add New Tutorial**
3. Fill in tutorial details and upload video
4. Thumbnail auto-generates from video (or upload custom)
5. Manage existing tutorials (edit/delete)

## 🔄 Daily Trick Cron Job

The app uses a cron job to select a new "Daily Trick" every day at midnight.

### Vercel Deployment (Automatic)

The `vercel.json` file configures automatic daily cron execution on Vercel.

### Manual Trigger

You can manually trigger the daily trick update:

```bash
curl -X GET https://your-domain.com/api/cron/daily-trick \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Alternative Cron Services

If not using Vercel, set up a cron job with:
- GitHub Actions
- AWS EventBridge
- Render Cron Jobs
- Any external cron service

Schedule: `0 0 * * *` (Daily at midnight UTC)

## 🎨 Design Philosophy

This app is built with a **mobile-first** approach, focusing on:
- Clean, modern UI with smooth animations
- Intuitive navigation with bottom tab bar
- Beautiful gradients and color schemes
- Touch-friendly interactions
- Fast loading and responsive design

## 🏗️ Project Structure

```
aerial-trick/
├── app/
│   ├── api/              # API routes
│   │   ├── motivation/   # OpenAI motivational messages
│   │   ├── daily-trick/  # Daily trick management
│   │   └── cron/         # Cron job endpoints
│   ├── auth/             # Authentication pages
│   ├── admin/            # Admin portal
│   ├── tutorial/         # Tutorial detail pages
│   ├── community/        # Community feed
│   ├── progress/         # Progress tracking
│   ├── favorites/        # Favorites list
│   ├── profile/          # User profile
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/
│   ├── supabase/        # Supabase client setup
│   ├── types/           # TypeScript types
│   └── utils.ts         # Utility functions
├── supabase/            # Database schema & config
└── public/              # Static assets
```

## 🔐 Security Features

- Row Level Security (RLS) on all Supabase tables
- Secure authentication with Supabase Auth
- Protected API routes
- Cron job authentication
- Client-side and server-side validation

## 🎯 Future Enhancements

- [ ] Push notifications for daily tricks
- [ ] Direct messaging between users
- [ ] Video playback speed control
- [ ] Offline mode
- [ ] Native mobile apps (iOS/Android)
- [ ] Live streaming classes
- [ ] Instructor profiles
- [ ] Tutorial playlists
- [ ] Advanced search and filters

## 📄 License

MIT License - feel free to use this project for learning or your own aerial yoga platform!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Built with 💜 for the aerial yoga community
