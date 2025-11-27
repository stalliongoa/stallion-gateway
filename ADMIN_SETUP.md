# Admin Panel Setup Guide

## Quick Start

Your admin control panel is now ready! Here's how to use it:

### 1. Create Your Admin Account

1. Navigate to `/auth` in your browser
2. Click "Sign Up" tab
3. Create your account with:
   - Full Name
   - Email
   - Password (min 6 characters)

### 2. Grant Admin Access

**IMPORTANT**: After signing up, you need to grant yourself admin privileges:

1. Go to Lovable → Cloud tab → Database
2. Find the `user_roles` table
3. Click "Insert Row"
4. Fill in:
   - `user_id`: Copy your user ID from the `profiles` table
   - `role`: Select "admin"
5. Save

### 3. Access Admin Panel

1. Go to `/auth` and sign in
2. You'll be redirected to `/admin` automatically
3. Start managing your content!

## Admin Panel Features

### Projects Tab
- Add new projects with images
- Edit existing projects
- Delete projects
- Set display order

### Team Members Tab
- Add team member profiles
- Include photos, bios, positions
- Contact information (email, phone)
- Reorder team members

### Clients Tab
- Add client testimonials
- Include company names
- Star ratings (1-5)
- Client photos

### Blog Posts Tab
- Create blog posts
- Rich text content
- Publish/unpublish toggle
- Auto-generate URL slugs
- Featured images

## Image Management

**Option 1: Use Image URLs**
- Upload images to any image hosting service
- Paste the URL in the "Image URL" field

**Option 2: Use Lovable Cloud Storage** (Coming Soon)
- Direct file uploads through admin panel
- Automatic optimization

## Content Guidelines

### Projects
- **Title**: Clear, descriptive name
- **Description**: Brief overview (2-3 sentences)
- **Category**: e.g., "Construction", "Renovation", "Design"
- **Image**: High quality, landscape orientation recommended

### Team Members
- **Image**: Professional headshot (square format best)
- **Bio**: 2-3 sentences about expertise
- **Position**: Job title

### Clients
- **Testimonial**: Keep under 200 words
- **Rating**: Honest rating (1-5 stars)
- **Image**: Logo or client photo

### Blog Posts
- **Title**: SEO-friendly, clear
- **Slug**: Auto-generated from title (or customize)
- **Excerpt**: 1-2 sentence summary
- **Content**: Full article content
- **Published**: Toggle to make live

## Display Order

Use the "Display Order" field to control the sequence items appear:
- Lower numbers appear first
- Use increments of 10 (0, 10, 20) for easy reordering
- Example: 0, 10, 20, 30...

## Security Best Practices

1. **Strong Password**: Use complex passwords
2. **Limited Access**: Only give admin role to trusted users
3. **Regular Backups**: Export data regularly
4. **Monitor Changes**: Check audit logs in Cloud tab

## Troubleshooting

### Can't access admin panel?
- Ensure you added admin role in user_roles table
- Clear browser cache and cookies
- Try signing out and back in

### Changes not appearing on site?
- Check if item is marked as "active" or "published"
- Verify display_order is set correctly
- Refresh the page

### Image not showing?
- Verify the image URL is publicly accessible
- Check if URL starts with `https://`
- Try opening the URL directly in a browser

## Next Steps

1. ✅ Add your first project
2. ✅ Upload team member profiles
3. ✅ Collect and add client testimonials
4. ✅ Write your first blog post
5. ✅ Share admin access with team members (if needed)

## Need Help?

- Check the DEPLOYMENT_GUIDE.md for hosting instructions
- Visit Lovable docs: https://docs.lovable.dev
- Review Cloud features: https://docs.lovable.dev/features/cloud

---

**Important**: The admin panel requires Lovable Cloud to function. Keep your backend connected when deploying to your own server.
