# 🌐 How to Host Your Privacy Policy (Free)

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Step 1: Create a GitHub Account
1. Go to https://github.com
2. Sign up for free
3. Verify your email

### Step 2: Create a New Repository
1. Click "+" → "New repository"
2. Name: `aerial-trick-privacy`
3. Description: "Privacy policy for Aerial Trick app"
4. Make it **Public**
5. Check "Add a README file"
6. Click "Create repository"

### Step 3: Create Privacy Policy Page
1. In your new repository, click "Add file" → "Create new file"
2. Name the file: `index.html`
3. Paste this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Aerial Trick</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #2c3e50;
            margin-top: 30px;
        }
        h3 {
            color: #555;
        }
        a {
            color: #3498db;
        }
        .last-updated {
            color: #7f8c8d;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>Privacy Policy for Aerial Trick</h1>
    <p class="last-updated">Last Updated: January 2025</p>

    <h2>Introduction</h2>
    <p>Aerial Trick ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.</p>

    <h2>Information We Collect</h2>
    
    <h3>Personal Information</h3>
    <p>When you create an account, we collect:</p>
    <ul>
        <li>Email address</li>
        <li>Display name (optional)</li>
        <li>Profile information you choose to provide</li>
    </ul>

    <h3>Usage Information</h3>
    <p>We automatically collect:</p>
    <ul>
        <li>Tutorial videos you view</li>
        <li>Your progress and completed tricks</li>
        <li>Tutorials you favorite or bookmark</li>
        <li>Community posts and interactions</li>
        <li>App usage statistics and analytics</li>
    </ul>

    <h3>Media Content</h3>
    <p>When you use certain features, we may collect:</p>
    <ul>
        <li>Progress photos you upload</li>
        <li>Community posts you share</li>
        <li>Profile pictures</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <p>We use the collected information to:</p>
    <ul>
        <li>Provide and maintain the app service</li>
        <li>Create and manage your account</li>
        <li>Track your learning progress</li>
        <li>Personalize your experience</li>
        <li>Show you relevant tutorial recommendations</li>
        <li>Enable community features</li>
        <li>Improve app functionality and user experience</li>
        <li>Send important service notifications</li>
        <li>Respond to your support requests</li>
    </ul>

    <h2>Data Storage and Security</h2>
    <ul>
        <li>Your data is securely stored using Supabase (a secure cloud database provider)</li>
        <li>We use industry-standard encryption for data transmission</li>
        <li>Your password is encrypted and never stored in plain text</li>
        <li>Media files (videos, photos) are stored securely in cloud storage</li>
    </ul>

    <h2>Data Sharing</h2>
    <p><strong>We do NOT:</strong></p>
    <ul>
        <li>Sell your personal information to third parties</li>
        <li>Share your data for advertising purposes</li>
        <li>Provide your information to third parties except as described below</li>
    </ul>

    <p><strong>We MAY share data with:</strong></p>
    <ul>
        <li><strong>Service Providers:</strong> Supabase (database hosting), cloud storage providers</li>
        <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
        <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
    </ul>

    <h2>Your Privacy Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your account and data</li>
        <li>Export your data</li>
        <li>Opt out of non-essential communications</li>
    </ul>
    <p>To exercise these rights, contact us at: <a href="mailto:support@aerialtrick.app">support@aerialtrick.app</a></p>

    <h2>Children's Privacy</h2>
    <p>Our app is suitable for all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected information from a child under 13, please contact us immediately.</p>

    <h2>Third-Party Services</h2>
    <p>Our app uses the following third-party services:</p>
    <ul>
        <li><strong>Supabase:</strong> Database and authentication services (<a href="https://supabase.com/privacy" target="_blank">Supabase Privacy Policy</a>)</li>
        <li><strong>Cloud Storage:</strong> For video and image hosting</li>
    </ul>

    <h2>Analytics</h2>
    <p>We collect anonymous usage analytics to improve the app, including:</p>
    <ul>
        <li>Feature usage statistics</li>
        <li>App performance metrics</li>
        <li>Error reports</li>
    </ul>
    <p>This data is anonymized and cannot be used to identify you personally.</p>

    <h2>Data Retention</h2>
    <ul>
        <li><strong>Account data:</strong> Retained while your account is active</li>
        <li><strong>Usage history:</strong> Retained indefinitely to track your progress</li>
        <li><strong>Deleted accounts:</strong> Data is permanently deleted within 30 days of account deletion request</li>
    </ul>

    <h2>International Users</h2>
    <p>Your data may be transferred to and stored in servers located outside your country. By using the app, you consent to this transfer.</p>

    <h2>Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes through:</p>
    <ul>
        <li>In-app notifications</li>
        <li>Email notification</li>
        <li>Updated "Last Updated" date at the top of this policy</li>
    </ul>

    <h2>Contact Us</h2>
    <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
    <p><strong>Email:</strong> <a href="mailto:support@aerialtrick.app">support@aerialtrick.app</a></p>
    <p><strong>App Developer:</strong> Aerial Trick<br>
    <strong>Effective Date:</strong> January 2025</p>

    <h2>Your Consent</h2>
    <p>By using Aerial Trick, you consent to this Privacy Policy.</p>

    <h2>California Privacy Rights (CCPA)</h2>
    <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
    <ul>
        <li>Right to know what personal information is collected</li>
        <li>Right to know if personal information is sold or disclosed</li>
        <li>Right to opt-out of the sale of personal information</li>
        <li>Right to deletion of personal information</li>
        <li>Right to non-discrimination for exercising your rights</li>
    </ul>
    <p>We do not sell your personal information.</p>

    <h2>European Privacy Rights (GDPR)</h2>
    <p>If you are in the European Economic Area, you have rights under the General Data Protection Regulation:</p>
    <ul>
        <li>Right to access your data</li>
        <li>Right to rectification of inaccurate data</li>
        <li>Right to erasure ("right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Rights related to automated decision making</li>
    </ul>
    <p>To exercise these rights, contact us at <a href="mailto:support@aerialtrick.app">support@aerialtrick.app</a>.</p>
</body>
</html>
```

4. Click "Commit new file"

### Step 4: Enable GitHub Pages
1. In your repository, click "Settings"
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes

### Step 5: Get Your URL
Your privacy policy will be available at:
```
https://[your-github-username].github.io/aerial-trick-privacy/
```

Example: If your GitHub username is "janesmith", your URL is:
```
https://janesmith.github.io/aerial-trick-privacy/
```

**Use this URL in your app store submissions!**

---

## Option 2: Create Simple HTML File and Host Anywhere

If you have web hosting, just upload the HTML file above to your server.

---

## Option 3: Use Google Sites (Free)

1. Go to https://sites.google.com
2. Create a new site
3. Paste your privacy policy content
4. Publish
5. Use the generated URL

---

## Option 4: Use a Privacy Policy Generator with Hosting

These services generate AND host your privacy policy:
- https://www.privacypolicies.com (free)
- https://www.termsfeed.com (free)
- https://www.iubenda.com (has free tier)

---

## ✅ After Hosting

Once your privacy policy is live:
1. Test the URL in a browser
2. Make sure it loads properly
3. Copy the URL
4. Use it in:
   - [ ] App Store Connect (iOS)
   - [ ] Google Play Console (Android)

---

## 📧 Don't Forget Support Email

You also need a support email. Options:
1. Create: support@aerialtrick.app (if you own the domain)
2. Use Gmail: yourname+aerialtrick@gmail.com
3. Use any email you check regularly

**Important:** Apple and Google will send important notices to this email!

