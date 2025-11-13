# 🚀 Deployment Guide

Deploy your Aerial Trick app to production.

## Recommended: Vercel Deployment

Vercel is the easiest way to deploy Next.js apps and includes automatic cron job support.

### Step 1: Prepare for Deployment

1. Make sure all environment variables are set in `.env.local`
2. Test the app locally: `npm run build && npm start`
3. Commit your code to Git (GitHub, GitLab, or Bitbucket)

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New Project**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)
   - `CRON_SECRET` (generate a random string)
6. Click **Deploy**

### Step 3: Configure Cron Job

The `vercel.json` file already configures the daily trick cron job. Vercel will automatically:
- Run `/api/cron/daily-trick` every day at midnight UTC
- Retry on failures
- Send email notifications on errors (if configured)

### Step 4: Update Supabase Site URL

In your Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
3. Add your Vercel URL to **Redirect URLs**: `https://your-app.vercel.app/**`

### Step 5: Test Production

1. Visit your Vercel URL
2. Create an account
3. Upload a tutorial
4. Test the daily trick: Visit `https://your-app.vercel.app/api/cron/daily-trick` (add auth header if CRON_SECRET is set)

## Alternative: Other Platforms

### Netlify

1. Deploy as Next.js app
2. Set environment variables
3. Use Netlify Functions for API routes
4. Set up external cron service (GitHub Actions, etc.) for daily trick

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Railway auto-deploys on push
4. Use Railway Cron for scheduled tasks

### Self-Hosted (VPS)

```bash
# On your server
git clone your-repo
cd aerial-trick
npm install
npm run build

# Set up environment variables
nano .env.local

# Run with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "aerial-trick" -- start

# Set up cron job
crontab -e
# Add: 0 0 * * * curl -X GET http://localhost:3000/api/cron/daily-trick -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables Reference

### Required

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (safe for client-side)

### Optional but Recommended

- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations (server-side only)
- `OPENAI_API_KEY`: OpenAI API key for AI-generated motivational messages
- `CRON_SECRET`: Secret token to secure cron endpoints

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] `.env.local` is in `.gitignore` (default)
- [ ] Supabase RLS policies are enabled (default in schema)
- [ ] Storage buckets are configured correctly
- [ ] CRON_SECRET is set and not exposed
- [ ] SUPABASE_SERVICE_ROLE_KEY is only in server-side code

## Performance Optimization

### Images
- Thumbnails are automatically generated from videos
- Consider using Next.js Image optimization for user uploads

### Database
- Indexes are already configured in the schema
- Monitor Supabase dashboard for slow queries

### Caching
- Next.js automatically caches pages
- Consider adding React Query for client-side caching

## Monitoring

### Vercel
- View logs in Vercel dashboard
- Set up error alerts
- Monitor cron job execution

### Supabase
- Monitor database usage
- Check storage limits
- Review API usage

### Uptime Monitoring
- Use UptimeRobot or similar service
- Monitor main pages and API endpoints
- Set up alerts for downtime

## Scaling

### When you grow:
1. **Upgrade Supabase Plan**: More database connections, storage, bandwidth
2. **Optimize Images**: Use CDN for static assets
3. **Database Replication**: For high traffic
4. **Rate Limiting**: Implement on API routes
5. **Caching**: Redis for session/data caching

## Troubleshooting Production

### Build Errors
- Check Node.js version (18+)
- Verify all dependencies are in `package.json`
- Run `npm run build` locally to catch errors early

### Runtime Errors
- Check Vercel/platform logs
- Verify environment variables are set
- Check Supabase connection limits

### Cron Not Running
- Verify `vercel.json` is in root directory
- Check cron execution logs in Vercel dashboard
- Test endpoint manually with curl

### Authentication Issues
- Verify Site URL in Supabase matches your domain
- Check Redirect URLs include all your domains
- Ensure cookies are enabled

## Backup Strategy

### Database
- Supabase automatically backs up database daily (Pro plan)
- Export data regularly: `pg_dump` via Supabase dashboard

### Storage
- Consider periodic exports of storage buckets
- Store backups in separate location (S3, etc.)

## Cost Estimation

### Supabase
- Free tier: Good for testing and small apps
- Pro ($25/mo): Recommended for production
- Scaling: Pay for usage beyond limits

### Vercel
- Hobby (Free): Good for personal projects
- Pro ($20/mo): Recommended for production
- Enterprise: For high-traffic apps

### OpenAI
- Pay per API call
- ~$0.002 per motivational message
- Can use fallback messages to reduce costs

---

## Support

For deployment issues:
- Check Vercel documentation
- Review Supabase docs
- Open an issue on GitHub

Happy deploying! 🚀

