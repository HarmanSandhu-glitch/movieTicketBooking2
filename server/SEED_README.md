# Database Seed Script

This script populates your Movie Ticket Booking System database with comprehensive test data.

## What Gets Created

### 📊 Summary
- **1 Admin User** - Your credentials for system management
- **20 Regular Users** - Sample customer accounts
- **8 Movie Halls** - Different theaters with varying capacities and pricing
- **~1,200+ Seats** - Automatically generated for all halls
- **80+ Shows** - Multiple screenings of 20 different movies
- **100+ Tickets** - Booked seats across completed and upcoming shows

### 🎬 Movies
20 popular movies including:
- The Dark Knight Returns
- Inception Dreams
- Interstellar Journey
- The Matrix Reloaded
- Avengers: Endgame
- Dune: Part Two
- Oppenheimer
- Spider-Man: No Way Home
- And more...

### 🏛️ Halls
8 theaters in different locations:
- Grand Theatre (Downtown Plaza, LA)
- Cinema Deluxe (Westside Mall, NY)
- Star Multiplex (City Center, Chicago)
- Royal Cinema (Harbor View, SF)
- Metro Cinema (East Side Square, Boston)
- Sunset Theatre (Beach Boulevard, Miami)
- Phoenix Cineplex (North Ridge, Seattle)
- Empire Theater (Central Station, DC)

Each hall has:
- Different seating capacities (Regular, Premium, VIP)
- Unique pricing structures ($11.99 - $29.99)
- Various amenities (IMAX, Dolby Atmos, 4DX, etc.)

### 💺 Seats
Automatically generated for each hall with:
- **VIP seats** - First 2 rows
- **Premium seats** - Next 2-3 rows  
- **Regular seats** - Remaining rows
- Proper row (A-O) and column numbering

### 🎟️ Shows
- Multiple screenings per movie across different halls
- Time slots: 10 AM, 1 PM, 4 PM, 7 PM, 10 PM
- Shows spanning from -7 days (past) to +14 days (future)
- Statuses: scheduled, completed, cancelled (5% chance)

### 🎫 Tickets
- Completed shows: 3-10 tickets each (more bookings)
- Upcoming shows: 1-5 tickets each (fewer bookings)
- Random seat selections (1-4 seats per booking)
- Proper price calculations based on seat types
- Seats marked as reserved

## Usage

### Run the Seed Script

```bash
cd server
npm run db:seed
```

### What Happens
1. ✅ Connects to MongoDB
2. 🗑️ Clears all existing data (Users, Halls, Shows, Seats, Tickets)
3. 👤 Creates admin user with your credentials
4. 👥 Creates 20 regular users
5. 🏛️ Creates 8 movie halls
6. 💺 Generates seats for each hall
7. 🎬 Creates 80+ movie shows
8. 🎟️ Creates 100+ tickets with bookings

### Output Example

```
📦 Connected to MongoDB
🗑️  Clearing existing data...
✅ Existing data cleared
👤 Creating admin user...
✅ Admin created: harmanjotsingh2003100@gmail.com
👥 Creating users...
✅ Created 20 users
🏛️  Creating halls...
   ✓ Created hall: Grand Theatre
   ✓ Created hall: Cinema Deluxe
   ...
✅ Created 8 halls
💺 Creating seats...
   ✓ Created 220 seats for Grand Theatre
   ...
✅ Created 1240 total seats
🎬 Creating shows...
✅ Created 85 shows
🎟️  Creating tickets...
✅ Created 127 tickets

📊 Seeding Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Users: 21 (including admin)
🏛️  Halls: 8
💺 Seats: 1240
🎬 Shows: 85
🎟️  Tickets: 127
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Admin Credentials:
   Email: harmanjotsingh2003100@gmail.com
   Password: harmanjot

👥 Sample User Credentials:
   Email: john.smith@example.com
   Password: password123

✅ Database seeded successfully!
👋 Database connection closed
```

## Credentials

### Admin Access
- **Email:** harmanjotsingh2003100@gmail.com
- **Password:** harmanjot
- **Role:** admin

### Test Users
All 20 test users have the same password:
- **Password:** password123

Sample emails:
- john.smith@example.com
- emma.j@example.com
- michael.b@example.com
- sarah.davis@example.com
- james.w@example.com
- ... (15 more)

## Features

### Realistic Data
- Movie posters from Unsplash
- Varied show times and dates
- Mix of past (completed) and future (scheduled) shows
- Random booking patterns
- Proper seat reservations
- Accurate pricing calculations

### Smart Generation
- Seats generated based on hall capacity
- VIP seats in premium positions (front rows)
- Shows distributed across multiple halls
- More bookings for completed shows
- Fewer bookings for upcoming shows
- Random seat selections per ticket

### Data Relationships
All relationships properly maintained:
- Shows ➜ Halls
- Seats ➜ Halls
- Tickets ➜ Users, Shows, Halls, Seats
- Reserved seats marked correctly

## ⚠️ Warning

**This script will DELETE all existing data** including:
- All users (except admin)
- All halls
- All shows
- All seats
- All tickets

Only run this script in development or when you want to reset your database completely.

## Troubleshooting

### Connection Issues
Make sure your `.env` file has the correct MongoDB URI:
```
MONGO_URI=your_mongodb_connection_string
```

### Permission Errors
Ensure your MongoDB user has read/write permissions.

### Script Hangs
If the script doesn't complete, check:
1. MongoDB is running
2. Network connection is stable
3. Sufficient disk space available

## Customization

You can modify the seed data in `seedData.js`:

- **Add more movies:** Update the `movies` array
- **Change hall configurations:** Modify the `halls` array
- **Adjust user count:** Add/remove from `users` array
- **Modify show times:** Change the time slots in show creation logic
- **Adjust ticket quantities:** Modify `numTickets` ranges

## Next Steps

After seeding:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Login as admin** to manage content

3. **Test the booking flow** with sample users

4. **Explore analytics** with the generated data

5. **Verify seat reservations** work correctly
