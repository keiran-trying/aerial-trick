# 🌐 How to Host Your Privacy Policy

You need to host your privacy policy online so Apple and Google can access it. Here are **3 easy options**:

---

## 🎯 Option 1: GitHub Pages (EASIEST - FREE)

**Perfect for:** Quick setup, no domain needed  
**Time:** 5 minutes  
**URL:** `https://yourusername.github.io/aerial-trick/privacy-policy.html`

### Steps:

#### 1. Make sure your project is on GitHub

```bash
cd /Users/keirancho/Downloads/aerial-trick

# If not already a git repo:
git init
git add .
git commit -m "Add privacy policy"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR-USERNAME/aerial-trick.git
git branch -M main
git push -u origin main
```

#### 2. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/YOUR-USERNAME/aerial-trick`
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Select **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes

#### 3. Access Your Privacy Policy

Your privacy policy will be at:
```
https://YOUR-USERNAME.github.io/aerial-trick/privacy-policy.html
```

**This is the URL you'll submit to Apple and Google!** ✅

---

## 🎯 Option 2: Netlify (EASY - FREE)

**Perfect for:** Better performance, custom domain  
**Time:** 5 minutes  
**URL:** `https://aerial-tricks.netlify.app/privacy-policy.html` (or custom domain)

### Steps:

#### 1. Sign up for Netlify

1. Go to: https://www.netlify.com/
2. Click **Sign up** → Choose **GitHub** (easiest)
3. Authorize Netlify to access your GitHub

#### 2. Deploy your site

1. Click **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Select your `aerial-trick` repository
4. Build settings:
   - **Base directory:** (leave empty)
   - **Build command:** (leave empty)
   - **Publish directory:** `/` (root)
5. Click **Deploy site**

#### 3. Get your URL

After deployment (1-2 minutes):
- Your site will be at: `https://random-name-12345.netlify.app/privacy-policy.html`
- Click **Site settings** → **Change site name** to make it nicer: `aerial-tricks`
- New URL: `https://aerial-tricks.netlify.app/privacy-policy.html`

**Submit this URL to Apple and Google!** ✅

---

## 🎯 Option 3: Your Own Domain (PROFESSIONAL)

**Perfect for:** Custom branding  
**Time:** 15 minutes (+ domain purchase)  
**URL:** `https://www.aerialtricks.com/privacy-policy.html`

### Steps:

#### 1. Buy a domain

Popular registrars:
- **Namecheap:** https://www.namecheap.com (~$10/year)
- **Google Domains:** https://domains.google (~$12/year)
- **GoDaddy:** https://www.godaddy.com (~$15/year)

Search for: `aerialtricks.com` or `aerialtricks.app`

#### 2. Host on GitHub Pages with custom domain

1. Follow "Option 1" to set up GitHub Pages
2. In GitHub repo settings → Pages:
   - Under "Custom domain", enter: `www.aerialtricks.com`
   - Check "Enforce HTTPS"
3. In your domain registrar (Namecheap, etc.):
   - Add a **CNAME record**:
     - Host: `www`
     - Value: `YOUR-USERNAME.github.io`
   - Add an **A record** (for root domain):
     - Host: `@`
     - Value: GitHub's IPs:
       ```
       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
       ```
4. Wait 10-30 minutes for DNS to propagate

#### 3. Access your privacy policy

Your URL will be:
```
https://www.aerialtricks.com/privacy-policy.html
```

**Submit this URL to Apple and Google!** ✅

---

## 📝 Important Notes

### Before Submitting:

1. **Test your URL** - Make sure it loads in a browser
2. **Use HTTPS** - Both Apple and Google require secure URLs
3. **Update email** - In `privacy-policy.html`, change `support@aerialtricks.com` to your real email
4. **Add to app** - Link to your privacy policy from your app's settings page

### Where to Submit:

**Apple App Store:**
- App Store Connect → Your App → App Information
- **Privacy Policy URL** field

**Google Play Store:**
- Google Play Console → Your App → Store Presence → Store Listing
- **Privacy Policy** field

---

## 🚀 Quick Recommendation

**For right now:** Use **GitHub Pages** (Option 1)
- No cost
- No setup
- Works immediately
- Accepted by both Apple and Google

**For later:** Consider buying `aerialtricks.com` (Option 3)
- More professional
- Can use for marketing website too
- Builds brand trust

---

## 🎯 Next Steps

After hosting your privacy policy:

1. ✅ Test the URL in your browser
2. ✅ Save the URL (you'll need it for app submission)
3. ✅ Move to next step: **Build Production App**

---

**Which option do you want to use?** Let me know and I'll help you set it up! 🌐



