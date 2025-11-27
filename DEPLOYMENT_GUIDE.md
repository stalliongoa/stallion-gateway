# Deployment Guide - Stallion Website

This guide will help you deploy your Stallion website to your cPanel server at stallion.co.in.

## Prerequisites

- Access to your cPanel account
- Node.js installed on your local machine (v18 or higher)
- Your domain stallion.co.in pointing to your server

## Step 1: Build the Project Locally

1. **Clone or download your project code** from Lovable:
   - Option A: Connect to GitHub in Lovable and clone the repository
   - Option B: Download the project files directly

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the production version**:
   ```bash
   npm run build
   ```
   
   This creates a `dist` folder with your production-ready website.

## Step 2: Prepare Your cPanel

1. **Log in to your cPanel account**

2. **Create a new directory** (if not exists):
   - Go to File Manager
   - Navigate to `public_html` (or your domain's root directory)
   - Create a folder or use the existing one for stallion.co.in

3. **Upload the files**:
   - Go to File Manager in cPanel
   - Navigate to your website's directory
   - Upload all files from the `dist` folder (not the folder itself, the contents)
   - This includes: `index.html`, `assets` folder, etc.

## Step 3: Configure .htaccess for React Router

Create a `.htaccess` file in your website root with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures all routes (like /about, /services, etc.) work correctly.

## Step 4: Set Up Environment Variables (Backend Features)

Since your site uses Lovable Cloud for backend features, you need to configure environment variables:

1. **In cPanel**, look for "Environment Variables" or use `.htaccess`:

Add to `.htaccess`:
```apache
SetEnv VITE_SUPABASE_URL "your_supabase_url"
SetEnv VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
```

**Get these values from Lovable**:
- Go to your Lovable project → Cloud tab → Settings
- Copy the Project URL and Anon Key

## Step 5: Database Setup (Important!)

Your admin panel requires a backend database. You have two options:

### Option A: Keep Using Lovable Cloud (Recommended)
- Your site will continue using Lovable's backend infrastructure
- No additional setup needed
- Just ensure environment variables are set correctly

### Option B: Self-Host Database
- You'll need to set up a PostgreSQL database
- Export your database schema from Lovable Cloud
- Import it to your own database
- Update connection strings

**Recommended**: Use Option A for simplicity.

## Step 6: Configure Domain & SSL

1. **Point your domain**:
   - In your domain registrar, ensure stallion.co.in points to your cPanel server IP
   - Usually done via A record

2. **Enable SSL**:
   - In cPanel, go to SSL/TLS
   - Install Let's Encrypt free SSL certificate
   - Enable "Force HTTPS redirect"

## Step 7: Set Up Admin User

1. Visit `https://stallion.co.in/auth`
2. Create your admin account
3. **IMPORTANT**: Add admin role to your user:
   - Go to Lovable Cloud → Database → user_roles table
   - Add a row with your user_id and role='admin'

## Directory Structure

Your final cPanel directory should look like:
```
public_html/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].css
  │   ├── index-[hash].js
  │   └── [other assets]
  ├── .htaccess
  └── robots.txt
```

## Troubleshooting

### Routes show 404 errors
- Check if `.htaccess` file exists and has correct rules
- Ensure mod_rewrite is enabled in Apache

### Admin panel not loading
- Check environment variables are set correctly
- Verify Lovable Cloud is accessible from your server
- Check browser console for errors

### Images not loading
- Verify all files from `dist/assets` are uploaded
- Check file permissions (should be 644 for files, 755 for folders)

### Backend features not working
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Check if your server can make external API calls
- Ensure CORS is properly configured

## Admin Panel Access

- **Login URL**: https://stallion.co.in/auth
- **Admin Panel**: https://stallion.co.in/admin

From the admin panel, you can:
- ✅ Add/Edit/Delete Projects
- ✅ Manage Team Members
- ✅ Manage Client Testimonials
- ✅ Create/Edit Blog Posts
- ✅ Upload images via URL

## Updating Your Site

To update your site after making changes:

1. Make changes in Lovable or your local code
2. Run `npm run build` locally
3. Upload new files from `dist` folder to cPanel
4. Clear browser cache to see changes

## Support

For issues:
- Check Lovable documentation: https://docs.lovable.dev
- Review browser console for errors
- Check cPanel error logs

---

**Note**: This guide assumes you're using Lovable Cloud for backend. For fully self-hosted backend (without Lovable Cloud), additional PostgreSQL setup is required.
