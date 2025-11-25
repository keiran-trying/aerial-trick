# 📧 Welcome Email Setup

## Overview

Supabase can automatically send welcome emails when users sign up - no external service needed!

---

## ✅ Built-in Email Templates

Supabase already sends these emails:
1. **Confirmation email** - when user signs up
2. **Magic link email** - for passwordless login
3. **Password reset email**

You can customize all of these!

---

## 🎨 Customize Welcome Email

### Step 1: Access Email Templates

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. You'll see templates for:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password

### Step 2: Customize "Confirm Signup" Template

This is your welcome email! Edit it:

```html
<h2>Welcome to Aerial Trick! 🎉</h2>

<p>Hi {{ .ConfirmationURL }}!</p>

<p>Thank you for joining our aerial yoga community! We're excited to help you on your aerial journey.</p>

<p>Click the button below to confirm your email and get started:</p>

<p><a href="{{ .ConfirmationURL }}" style="background: linear-gradient(to right, #9333ea, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">Confirm Your Email</a></p>

<h3>What's Next?</h3>

<ul>
  <li>✨ Complete your onboarding to set your skill level</li>
  <li>🎯 Browse our collection of tutorials</li>
  <li>📊 Track your progress as you learn</li>
  <li>🏆 Earn points and level up!</li>
</ul>

<p>Need help? Reply to this email or visit our support page.</p>

<p>Happy practicing!<br>
The Aerial Trick Team</p>

<hr>

<p style="font-size: 12px; color: #666;">
If you didn't create an account, you can safely ignore this email.
</p>
```

### Step 3: Test It

1. Sign up with a test email
2. Check your inbox
3. Verify the email looks good
4. Test the confirmation link

---

## 📬 Advanced: Custom Welcome Email Service

If you want MORE control (send emails anytime, not just on signup):

### Option 1: Supabase Edge Functions + Resend

**Resend** is a modern email service (free tier: 3,000 emails/month)

#### Setup:

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create account
   - Get API key

2. **Create Edge Function**

Create: `supabase/functions/send-welcome-email/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { email, name } = await req.json()

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Aerial Trick <hello@aerialtrick.app>',
        to: [email],
        subject: 'Welcome to Aerial Trick! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #9333ea, #ec4899); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Aerial Trick!</h1>
            </div>
            
            <div style="padding: 40px; background: #f9f9f9;">
              <h2>Hi ${name || 'there'}! 👋</h2>
              
              <p>We're thrilled to have you join our aerial yoga community!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">🎯 Get Started:</h3>
                <ul style="line-height: 1.8;">
                  <li>Complete your profile and set your skill level</li>
                  <li>Browse our extensive tutorial library</li>
                  <li>Track your progress and earn points</li>
                  <li>Join our community and share your journey</li>
                </ul>
              </div>
              
              <a href="https://aerialtrick.app" style="display: inline-block; background: linear-gradient(to right, #9333ea, #ec4899); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
                Open the App
              </a>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Need help? Just reply to this email!
              </p>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>© 2025 Aerial Trick. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

3. **Deploy Edge Function**

```bash
supabase functions deploy send-welcome-email --project-ref YOUR_PROJECT_REF
```

4. **Set Environment Variable**

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key --project-ref YOUR_PROJECT_REF
```

5. **Trigger on User Signup**

Use Supabase Database Webhooks:

```sql
-- Create function to call Edge Function on user signup
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object(
        'email', NEW.email,
        'name', NEW.raw_user_meta_data->>'name'
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email();
```

---

### Option 2: SendGrid (Alternative)

SendGrid is another popular email service:

- Free tier: 100 emails/day
- Setup is similar to Resend
- API docs: https://sendgrid.com/docs/api-reference/

---

### Option 3: AWS SES (For Scale)

If you grow big:

- Very cheap at scale
- $0.10 per 1,000 emails
- Requires more setup
- Good for 100k+ emails/month

---

## 🎯 Recommended Approach

**For Your App:**

1. **Start with Supabase's built-in templates** (free, easy)
   - Customize the confirmation email
   - Add your branding
   - Good enough for launch!

2. **Add Resend later** (when you need more features)
   - Onboarding email sequences
   - Weekly progress summaries
   - Tutorial recommendations via email
   - Re-engagement campaigns

---

## 📨 Email Best Practices

### Subject Lines:
✅ "Welcome to Aerial Trick! 🎉"  
✅ "Your Aerial Journey Starts Now"  
❌ "Confirm your email"  

### Content:
- Keep it short and scannable
- Use emojis sparingly
- Include clear call-to-action
- Mobile-friendly design
- Test on multiple email clients

### Timing:
- **Welcome email**: Immediately on signup
- **Day 3**: "How's it going?" check-in
- **Day 7**: Progress summary
- **Day 30**: Monthly recap

---

## 🚫 About Fake Comments (Question #9)

**DON'T do this.** Here's why:

1. **Violates App Store policies** - Can get your app banned
2. **Unethical** - Deceives users
3. **Backfires** - Users will find out
4. **Legal issues** - False advertising

**Better alternatives:**

1. **Seed with real content:**
   - Ask beta testers to post
   - Create your own tutorials first
   - Invite yoga instructors

2. **Show activity differently:**
   - "10 people viewed this today"
   - "Trending in your area"
   - "Editor's pick"

3. **Build organic engagement:**
   - Daily challenges
   - Community contests
   - Featured user of the week
   - Share on social media

---

## 💰 About Stripe (Question #10)

**Do you need Stripe?**

It depends on your monetization strategy:

### ✅ You NEED Stripe if:
- Paid premium features
- Subscription model
- In-app purchases (web)
- Course payments
- Tip instructors

### ❌ You DON'T need Stripe if:
- 100% free app
- Only ads for revenue
- Using Apple/Google in-app purchases

### 💡 Monetization Ideas:

**Free Model:**
- Free basic tutorials
- Ads between tutorials
- No Stripe needed

**Freemium Model:**
- Free basic content
- Premium subscription ($9.99/month)
  - Advanced tutorials
  - Personalized plans
  - No ads
  - Progress analytics
- **Needs Stripe** (for web) or Apple/Google IAP (for mobile)

**Hybrid:**
- Free app with IAP for premium content
- Use Apple/Google payment (they take 30%)
- OR use Stripe on web (they take 2.9%)

---

## 🎯 My Recommendation

For your Aerial Trick app:

1. **Launch as FREE** - Focus on getting users
2. **Build email list** - Using Supabase built-in emails
3. **Grow organically** - No fake engagement
4. **Add monetization later** - Once you have 1000+ active users

**When ready to monetize:**
- Stripe for web subscriptions
- Apple/Google IAP for mobile
- Both take ~30% but worth it

---

**Questions? Let me know!** 🚀


