# 🔗 Get Your Supabase Database Connection String

## The Issue
If you see a blank connection string in Supabase, it means you need to set up your database password first.

## Step 1: Set Database Password

### 1.1 Go to Database Settings
1. Open [supabase.com](https://supabase.com)
2. Sign in and select your **Lines Genius** project
3. Go to **Settings** → **Database**

### 1.2 Set Database Password
1. Look for **"Database Password"** section
2. If you see "No password set" or it's blank:
   - Click **"Generate new password"** or **"Reset database password"**
   - Copy and save this password securely
   - Click **"Update password"**

### 1.3 Wait for Update
- It may take 1-2 minutes for the password to be applied
- Refresh the page after waiting

## Step 2: Get Connection String

### Method 1: From Database Settings
1. After setting password, go to **Settings** → **Database**
2. Scroll down to **"Connection string"**
3. Copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Method 2: From API Settings
1. Go to **Settings** → **API**
2. Scroll down to **"Database URL"**
3. Copy the connection string

### Method 3: Manual Construction
If still blank, construct it manually:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Where:
- `[YOUR-PASSWORD]` = The password you just set
- `[YOUR-PROJECT-REF]` = Found in **Settings** → **General** → **Reference ID**

## Step 3: Test Connection

### 3.1 Test Locally First
1. Add the connection string to your backend `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```

2. Test the connection:
   ```bash
   cd backend
   npx prisma db pull
   ```

3. If successful, you'll see your database schema

### 3.2 Common Issues

**Issue**: "Password authentication failed"
- **Solution**: Double-check the password is correct
- **Solution**: Try resetting the password again

**Issue**: "Connection refused"
- **Solution**: Check if the project reference ID is correct
- **Solution**: Ensure your Supabase project is active (not paused)

**Issue**: "SSL connection required"
- **Solution**: Add `?sslmode=require` to the end of your connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?sslmode=require
   ```

## Step 4: Alternative - Use Supabase CLI

If the dashboard isn't working, you can use the CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Get your project details
supabase projects list

# Get connection info
supabase db show --project-ref [YOUR-PROJECT-REF]
```

## Step 5: Verify Your Setup

Once you have the connection string:

1. **Test locally**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Check health endpoint**:
   ```
   http://localhost:3001/health
   ```

3. **Test database operations**:
   - Try registering a user
   - Check if data appears in Supabase dashboard

## 🎯 Next Steps

Once you have your working connection string:

1. ✅ **Test locally** to ensure it works
2. ✅ **Deploy to Railway** with this connection string
3. ✅ **Update frontend** to use Railway API URL
4. ✅ **Test end-to-end** functionality

## 🚨 Important Security Notes

1. **Never commit** your database password to Git
2. **Use environment variables** for all sensitive data
3. **Keep your password secure** - treat it like a master key
4. **Consider IP restrictions** in Supabase if needed

## Need Help?

If you're still having trouble:
1. Check if your Supabase project is on the free tier (has limitations)
2. Verify your account email is confirmed
3. Try creating a new database password
4. Contact Supabase support if the issue persists

Your connection string should look like this when complete:
```
postgresql://postgres:your_actual_password@db.abcdefghijklmnop.supabase.co:5432/postgres
```