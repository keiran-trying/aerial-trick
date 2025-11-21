# 🌐 Setting Up Your Domain & Custom Email

Great news! You have **keiranaerial.com** - Let's set it up properly!

---

## 📧 Part 1: Custom Email Address (support@keiranaerial.com)

**YES!** You can absolutely create custom email addresses like:
- `support@keiranaerial.com`
- `info@keiranaerial.com`
- `hello@keiranaerial.com`

This looks WAY more professional than Gmail! 🎯

### 🎯 Best Options for Custom Email:

---

### Option 1: Google Workspace (RECOMMENDED)

**Best for:** Professional, reliable, familiar Gmail interface  
**Cost:** $6/month per user  
**URL:** https://workspace.google.com

**Features:**
- ✅ Custom email: support@keiranaerial.com
- ✅ Uses Gmail interface (you already know it!)
- ✅ 30GB storage
- ✅ Professional look
- ✅ Easy setup with your domain
- ✅ Can forward to keiran.aerial@gmail.com if you want

**Setup Steps:**

1. **Go to:** https://workspace.google.com
2. **Click "Get Started"**
3. **Enter your business info:**
   - Business name: Aerial Tricks (or Keiran Aerial)
   - Number of employees: Just you (1)
   - Country: Your location
4. **Enter your domain:** keiranaerial.com
5. **Create your email:** support@keiranaerial.com
6. **Verify domain ownership:**
   - Google will give you a TXT record
   - Add it to your domain registrar (where you bought keiranaerial.com)
7. **Set up MX records** (Google provides these)
8. **Done!** You'll have support@keiranaerial.com

**Time:** 30 minutes setup

---

### Option 2: Zoho Mail (FREE or CHEAP)

**Best for:** Budget-friendly, still professional  
**Cost:** FREE for 1 user (5GB) or $1/month (10GB)  
**URL:** https://www.zoho.com/mail/

**Features:**
- ✅ Custom email: support@keiranaerial.com
- ✅ Clean interface
- ✅ FREE plan available!
- ✅ Good for startups

**Setup Steps:**

1. **Go to:** https://www.zoho.com/mail/
2. **Click "Sign Up for Free"**
3. **Enter your domain:** keiranaerial.com
4. **Create email:** support@keiranaerial.com
5. **Verify domain** (similar to Google)
6. **Add MX records** to your domain
7. **Done!**

**Time:** 20 minutes setup

---

### Option 3: Email Forwarding (EASIEST - FREE)

**Best for:** Start now, upgrade later  
**Cost:** FREE  
**How it works:** support@keiranaerial.com → forwards to keiran.aerial@gmail.com

**Setup Steps:**

1. **Log in to your domain registrar** (where you bought keiranaerial.com)
   - GoDaddy, Namecheap, Google Domains, etc.

2. **Find "Email Forwarding" section**
   - Usually under: Email, Forwarding, or Email Management

3. **Create forwarding rule:**
   - From: support@keiranaerial.com
   - To: keiran.aerial@gmail.com

4. **Done!** Now emails sent to support@keiranaerial.com go to your Gmail

**Limitation:** You can RECEIVE emails, but when you REPLY, it shows as keiran.aerial@gmail.com (not as professional)

**Time:** 5 minutes setup

---

## 🌐 Part 2: Host Your Privacy Policy on keiranaerial.com

Now let's host your privacy policy at:
```
https://www.keiranaerial.com/privacy-policy.html
```

### 🎯 Best Options for Hosting:

---

### Option A: GitHub Pages + Custom Domain (EASIEST)

**Cost:** FREE  
**Time:** 15 minutes

**Setup Steps:**

#### Step 1: Push your code to GitHub

```bash
cd /Users/keirancho/Downloads/aerial-trick

# Initialize git (if not already)
git init
git add .
git commit -m "Add privacy policy"

# Create GitHub repo and push
# (Go to github.com and create a new repo called "aerial-trick")
git remote add origin https://github.com/YOUR-USERNAME/aerial-trick.git
git branch -M main
git push -u origin main
```

#### Step 2: Enable GitHub Pages

1. Go to your GitHub repo: `https://github.com/YOUR-USERNAME/aerial-trick`
2. Click **Settings** → **Pages**
3. Under "Source":
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

#### Step 3: Add Custom Domain to GitHub

1. Still in GitHub Pages settings
2. Under **Custom domain**, enter: `www.keiranaerial.com`
3. Check **Enforce HTTPS**
4. Click **Save**

#### Step 4: Update DNS Records

1. **Log in to your domain registrar** (where you bought keiranaerial.com)
2. **Go to DNS settings**
3. **Add these records:**

**CNAME Record (for www):**
```
Type: CNAME
Host: www
Value: YOUR-GITHUB-USERNAME.github.io
TTL: Automatic (or 3600)
```

**A Records (for root domain):**
```
Type: A
Host: @
Value: 185.199.108.153
TTL: Automatic

Type: A
Host: @
Value: 185.199.109.153
TTL: Automatic

Type: A
Host: @
Value: 185.199.110.153
TTL: Automatic

Type: A
Host: @
Value: 185.199.111.153
TTL: Automatic
```

4. **Save** and wait 10-30 minutes for DNS to propagate

#### Step 5: Test!

After 10-30 minutes, visit:
```
https://www.keiranaerial.com/privacy-policy.html
```

✅ **This is your Privacy Policy URL for App Store submission!**

---

### Option B: Netlify + Custom Domain

**Cost:** FREE  
**Time:** 15 minutes  
**Benefit:** Faster, better performance

**Setup Steps:**

#### Step 1: Deploy to Netlify

1. Go to: https://www.netlify.com/
2. Sign up with GitHub
3. Click **Add new site** → **Import from GitHub**
4. Select your `aerial-trick` repo
5. Click **Deploy site**

#### Step 2: Add Custom Domain

1. After deployment, click **Domain settings**
2. Click **Add custom domain**
3. Enter: `www.keiranaerial.com`
4. Netlify will show you DNS records to add

#### Step 3: Update DNS

1. Go to your domain registrar
2. Add the CNAME/A records Netlify provides
3. Wait 10-30 minutes

#### Step 4: Enable HTTPS

1. In Netlify, go to **Domain settings** → **HTTPS**
2. Click **Verify DNS configuration**
3. Once verified, Netlify automatically enables HTTPS

#### Step 5: Test!

```
https://www.keiranaerial.com/privacy-policy.html
```

✅ **Submit this URL to App Stores!**

---

## 📝 Summary & Recommendations

### For Email:

**Right Now (FREE):**
- Set up **Email Forwarding**: support@keiranaerial.com → keiran.aerial@gmail.com
- Takes 5 minutes
- You can upgrade later

**Before Launch (Professional):**
- Get **Google Workspace** ($6/month)
- Full support@keiranaerial.com email
- Professional replies
- Better for customer support

### For Privacy Policy Hosting:

**Best Option:**
- Use **GitHub Pages** with your custom domain
- FREE forever
- Accepted by Apple & Google
- Easy to update

**Your Final URLs:**
- Privacy Policy: `https://www.keiranaerial.com/privacy-policy.html`
- Main site (later): `https://www.keiranaerial.com`

---

## 🎯 Next Steps - Choose Your Path:

**Option A (Quick Start):**
1. Set up email forwarding NOW (5 mins)
2. Host privacy policy on GitHub Pages (15 mins)
3. Use these for app submission
4. Upgrade email to Google Workspace later

**Option B (Professional from Start):**
1. Set up Google Workspace NOW (30 mins)
2. Host privacy policy on GitHub Pages (15 mins)
3. Update privacy policy to use support@keiranaerial.com
4. Submit to app stores

---

## 🤔 What I Recommend:

**For right now:**
- ✅ Email forwarding (free, quick)
- ✅ Keep using keiran.aerial@gmail.com in privacy policy
- ✅ Host on GitHub Pages with your domain

**Before app goes live:**
- ✅ Upgrade to Google Workspace
- ✅ Update privacy policy to support@keiranaerial.com
- ✅ More professional for customer emails

---

**Which path do you want to take?** Let me know and I'll guide you through it! 🚀

Or if you want, we can:
- **Skip for now** and move to next step (Build Production App)
- **Do the quick setup** (email forwarding + GitHub Pages)
- **Do the full professional setup** (Google Workspace + custom domain)

What would you like to do? 😊

