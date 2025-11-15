# Quick Fix Guide - Apply These Changes

## 🚀 All code changes have been made! Here's what you need to do:

### Step 1: Restart Your Servers

Since the backend and frontend are running locally, you need to restart them to apply the changes:

#### Backend:
```bash
# Stop the current backend server (Ctrl+C)
# Then restart it
cd "/home/omen/Desktop/Projects/Mini Project"
npm run dev
```

#### Frontend:
```bash
# Stop the current frontend server (Ctrl+C)
# Then restart it
cd "/home/omen/Desktop/Projects/Mini Project/Frontend"
npm run dev
```

---

### Step 2: Update Database (Choose ONE method)

#### Option A: Using the Shell Script (Easiest)
```bash
cd "/home/omen/Desktop/Projects/Mini Project"
./scripts/run-status-migration.sh
```

#### Option B: Direct SQL Command
```bash
# If you have PostgreSQL access
cd "/home/omen/Desktop/Projects/Mini Project"
psql -U your_username -d kolabit -f scripts/update-status.sql
```

#### Option C: Using Docker (if database is in Docker)
```bash
# Find your container name
docker ps

# Run the SQL script
docker exec -i your_postgres_container_name psql -U your_username -d kolabit < scripts/update-status.sql
```

#### Option D: Manual SQL (using any DB client)
```sql
UPDATE projects 
SET status = 'RECRUITING' 
WHERE status = 'PLANNING';
```

---

### Step 3: Verify the Fixes

Open your browser and navigate to the project detail page. You should now see:

✅ **Positions Open**: Shows 3 (not 2) for a project with 4 max members and 1 current member
✅ **Team Members**: Avatars display properly with initials/images
✅ **Status**: Shows "RECRUITING" instead of "PLANNING"

---

## 📝 What Was Fixed

1. **Positions Open Calculation** - Removed extra -1 from formula
2. **Team Member Avatars** - Fixed data structure access to show user info
3. **Status Display** - Changed from PLANNING to RECRUITING throughout codebase

---

## 🔍 Files That Were Modified

### Frontend:
- `Frontend/app/projects/[id]/page.tsx`
- `Frontend/lib/types.ts`

### Backend:
- `src/services/projectService.ts`
- `src/types/index.ts`
- `src/validators/project.ts`

### Documentation:
- `API_TESTING_GUIDE.md`
- `DATABASE_OVERVIEW.md`

---

## ⚠️ Important Notes

- **No breaking changes** - All changes are backward compatible
- **Restart required** - Backend and frontend must be restarted to apply changes
- **Database migration** - Run ONLY ONCE to update existing data
- **New projects** - Will automatically use RECRUITING status

---

## 🆘 Troubleshooting

### If avatars still don't show:
- Check browser console for errors
- Verify the API response includes `user` object in `members` array
- Clear browser cache and reload

### If status still shows PLANNING:
- Verify you ran the database migration
- Check if backend server was restarted
- Verify API response shows "RECRUITING" status

### If positions count is wrong:
- Verify frontend was restarted
- Check browser console for calculation errors
- Inspect the `maxMembers` and `members.length` values

---

## 📚 More Information

See `BUG_FIXES_SUMMARY.md` for detailed technical information about all changes.
