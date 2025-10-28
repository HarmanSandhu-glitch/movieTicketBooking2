import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from './configs/config.js';
import User from './models/user_model.js';
import Hall from './models/hall_model.js';
import Show from './models/show_model.js';
import Seat from './models/seat_model.js';
import Ticket from './models/ticket_model.js';
import logger from './utils/logger.js';

// Admin credentials
const ADMIN_EMAIL = 'harmanjotsingh2003100@gmail.com';
const ADMIN_PASSWORD = 'harmanjot';

// Movie data with poster URLs
const movies = [
  {
    name: 'The Dark Knight Returns',
    description: 'Batman faces his greatest challenge yet as he battles against a corrupt society and powerful enemies.',
    length: 152,
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500',
  },
  {
    name: 'Inception Dreams',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    length: 148,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500',
  },
  {
    name: 'Interstellar Journey',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    length: 169,
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500',
  },
  {
    name: 'The Matrix Reloaded',
    description: 'Neo and his allies race against time before the machines discover the city of Zion and destroy it.',
    length: 138,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
  },
  {
    name: 'Avengers: Endgame',
    description: 'After the devastating events, the Avengers assemble once more to reverse Thanos\' actions and restore balance.',
    length: 181,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500',
  },
  {
    name: 'Jurassic World Evolution',
    description: 'A new theme park built on the original site faces deadly consequences when dinosaurs break free.',
    length: 124,
    posterUrl: 'https://images.unsplash.com/photo-1628432136678-43ff9be34064?w=500',
  },
  {
    name: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    length: 166,
    posterUrl: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500',
  },
  {
    name: 'The Godfather Legacy',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    length: 175,
    posterUrl: 'https://images.unsplash.com/photo-1574267432644-f65e49f7e38a?w=500',
  },
  {
    name: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    length: 180,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
  },
  {
    name: 'Spider-Man: No Way Home',
    description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed, causing the multiverse to tear open.',
    length: 148,
    posterUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500',
  },
  {
    name: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.',
    length: 142,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
  },
  {
    name: 'Pulp Fiction Revisited',
    description: 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    length: 154,
    posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500',
  },
  {
    name: 'The Lord of the Rings',
    description: 'A meek Hobbit and eight companions set out on a journey to destroy a powerful ring and save Middle-earth.',
    length: 178,
    posterUrl: 'https://images.unsplash.com/photo-1618945524163-32451704c5d7?w=500',
  },
  {
    name: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.',
    length: 142,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
  },
  {
    name: 'The Silence of the Lambs',
    description: 'A young FBI cadet must receive help from an incarcerated cannibal killer to catch another serial killer.',
    length: 118,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
  },
  {
    name: 'Saving Private Ryan',
    description: 'Following the Normandy Landings, a group of soldiers go behind enemy lines to retrieve a paratrooper.',
    length: 169,
    posterUrl: 'https://images.unsplash.com/photo-1574267432644-f65e49f7e38a?w=500',
  },
  {
    name: 'The Green Mile',
    description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of murder.',
    length: 189,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500',
  },
  {
    name: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
    length: 155,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500',
  },
  {
    name: 'The Prestige',
    description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.',
    length: 130,
    posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
  },
  {
    name: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between two families.',
    length: 132,
    posterUrl: 'https://images.unsplash.com/photo-1574267432644-f65e49f7e38a?w=500',
  },
];

// Hall configurations
const halls = [
  {
    name: 'Grand Theatre',
    location: 'Downtown Plaza, Los Angeles',
    normalSittingCapacity: 150,
    vipSittingCapacity: 30,
    premiumSittingCapacity: 40,
    normalSeatPrice: 12.99,
    vipSeatPrice: 24.99,
    premiumSeatPrice: 18.99,
    amenities: ['IMAX', '4K Projection', 'Dolby Atmos', 'Reclining Seats', 'In-seat Service'],
  },
  {
    name: 'Cinema Deluxe',
    location: 'Westside Mall, New York',
    normalSittingCapacity: 120,
    vipSittingCapacity: 25,
    premiumSittingCapacity: 35,
    normalSeatPrice: 14.99,
    vipSeatPrice: 27.99,
    premiumSeatPrice: 20.99,
    amenities: ['3D Capability', 'Premium Sound', 'Reserved Seating', 'VIP Lounge'],
  },
  {
    name: 'Star Multiplex',
    location: 'City Center, Chicago',
    normalSittingCapacity: 180,
    vipSittingCapacity: 35,
    premiumSittingCapacity: 45,
    normalSeatPrice: 11.99,
    vipSeatPrice: 22.99,
    premiumSeatPrice: 17.99,
    amenities: ['Dolby Vision', 'Immersive Audio', 'Stadium Seating', 'Concession Stand'],
  },
  {
    name: 'Royal Cinema',
    location: 'Harbor View, San Francisco',
    normalSittingCapacity: 100,
    vipSittingCapacity: 20,
    premiumSittingCapacity: 30,
    normalSeatPrice: 15.99,
    vipSeatPrice: 29.99,
    premiumSeatPrice: 22.99,
    amenities: ['Premium Leather Seats', 'Full Bar', 'Gourmet Menu', 'Private Boxes'],
  },
  {
    name: 'Metro Cinema',
    location: 'East Side Square, Boston',
    normalSittingCapacity: 140,
    vipSittingCapacity: 28,
    premiumSittingCapacity: 38,
    normalSeatPrice: 13.49,
    vipSeatPrice: 25.49,
    premiumSeatPrice: 19.49,
    amenities: ['Digital Projection', 'Surround Sound', 'Wide Screen', 'Accessibility'],
  },
  {
    name: 'Sunset Theatre',
    location: 'Beach Boulevard, Miami',
    normalSittingCapacity: 160,
    vipSittingCapacity: 32,
    premiumSittingCapacity: 42,
    normalSeatPrice: 12.49,
    vipSeatPrice: 23.99,
    premiumSeatPrice: 18.49,
    amenities: ['Ocean View', 'Rooftop Access', 'Premium Snacks', 'Climate Control'],
  },
  {
    name: 'Phoenix Cineplex',
    location: 'North Ridge, Seattle',
    normalSittingCapacity: 130,
    vipSittingCapacity: 26,
    premiumSittingCapacity: 36,
    normalSeatPrice: 13.99,
    vipSeatPrice: 26.99,
    premiumSeatPrice: 20.49,
    amenities: ['4DX Experience', 'Motion Seats', 'Special Effects', 'Kids Area'],
  },
  {
    name: 'Empire Theater',
    location: 'Central Station, Washington DC',
    normalSittingCapacity: 170,
    vipSittingCapacity: 34,
    premiumSittingCapacity: 44,
    normalSeatPrice: 14.49,
    vipSeatPrice: 27.49,
    premiumSeatPrice: 21.49,
    amenities: ['Historic Building', 'Luxury Seating', 'Private Events', 'Art Gallery'],
  },
];

// User data
const users = [
  { name: 'John Smith', email: 'john.smith@example.com', password: 'password123', role: 'user' },
  { name: 'Emma Johnson', email: 'emma.j@example.com', password: 'password123', role: 'user' },
  { name: 'Michael Brown', email: 'michael.b@example.com', password: 'password123', role: 'user' },
  { name: 'Sarah Davis', email: 'sarah.davis@example.com', password: 'password123', role: 'user' },
  { name: 'James Wilson', email: 'james.w@example.com', password: 'password123', role: 'user' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@example.com', password: 'password123', role: 'user' },
  { name: 'Robert Taylor', email: 'robert.t@example.com', password: 'password123', role: 'user' },
  { name: 'Jennifer Martinez', email: 'jennifer.m@example.com', password: 'password123', role: 'user' },
  { name: 'David Garcia', email: 'david.garcia@example.com', password: 'password123', role: 'user' },
  { name: 'Mary Rodriguez', email: 'mary.r@example.com', password: 'password123', role: 'user' },
  { name: 'Christopher Lee', email: 'chris.lee@example.com', password: 'password123', role: 'user' },
  { name: 'Patricia White', email: 'patricia.w@example.com', password: 'password123', role: 'user' },
  { name: 'Daniel Harris', email: 'daniel.harris@example.com', password: 'password123', role: 'user' },
  { name: 'Linda Clark', email: 'linda.clark@example.com', password: 'password123', role: 'user' },
  { name: 'Matthew Lewis', email: 'matthew.lewis@example.com', password: 'password123', role: 'user' },
  { name: 'Nancy Walker', email: 'nancy.walker@example.com', password: 'password123', role: 'user' },
  { name: 'Joseph Hall', email: 'joseph.hall@example.com', password: 'password123', role: 'user' },
  { name: 'Karen Allen', email: 'karen.allen@example.com', password: 'password123', role: 'user' },
  { name: 'Thomas Young', email: 'thomas.young@example.com', password: 'password123', role: 'user' },
  { name: 'Betty King', email: 'betty.king@example.com', password: 'password123', role: 'user' },
];

// Helper function to generate seats for a hall
const generateSeats = (hall) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  
  let vipCounter = 0;
  let premiumCounter = 0;
  let normalCounter = 0;
  let currentRow = 0;

  // VIP seats in first 2 rows
  const vipRowCount = Math.ceil(hall.vipSittingCapacity / 15);
  for (let r = 0; r < vipRowCount && currentRow < rows.length && vipCounter < hall.vipSittingCapacity; r++) {
    const seatsInRow = Math.min(15, hall.vipSittingCapacity - vipCounter);
    for (let c = 1; c <= seatsInRow; c++) {
      seats.push({
        hall: hall._id,
        seatNo: `${rows[currentRow]}${c}`,
        row: rows[currentRow],
        column: c,
        seatType: 'VIP',
      });
      vipCounter++;
    }
    currentRow++;
  }

  // Premium seats in next rows
  const premiumRowCount = Math.ceil(hall.premiumSittingCapacity / 15);
  for (let r = 0; r < premiumRowCount && currentRow < rows.length && premiumCounter < hall.premiumSittingCapacity; r++) {
    const seatsInRow = Math.min(15, hall.premiumSittingCapacity - premiumCounter);
    for (let c = 1; c <= seatsInRow; c++) {
      seats.push({
        hall: hall._id,
        seatNo: `${rows[currentRow]}${c}`,
        row: rows[currentRow],
        column: c,
        seatType: 'Premium',
      });
      premiumCounter++;
    }
    currentRow++;
  }

  // Regular seats in remaining rows
  const normalRowCount = Math.ceil(hall.normalSittingCapacity / 15);
  for (let r = 0; r < normalRowCount && currentRow < rows.length && normalCounter < hall.normalSittingCapacity; r++) {
    const seatsInRow = Math.min(15, hall.normalSittingCapacity - normalCounter);
    for (let c = 1; c <= seatsInRow; c++) {
      seats.push({
        hall: hall._id,
        seatNo: `${rows[currentRow]}${c}`,
        row: rows[currentRow],
        column: c,
        seatType: 'Regular',
      });
      normalCounter++;
    }
    currentRow++;
  }

  return seats;
};

// Helper function to get random items from array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoUri);
    
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Hall.deleteMany({});
    await Show.deleteMany({});
    await Seat.deleteMany({});
    await Ticket.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await User.create({
      name: 'Harmanjot Singh',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      confirm_password: hashedPassword,
      role: 'admin',
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create regular users
    console.log('👥 Creating users...');
    const hashedUserPass = await bcrypt.hash('password123', 12);
    const usersToCreate = users.map(userData => ({
      name: userData.name,
      email: userData.email,
      password: hashedUserPass,
      confirm_password: hashedUserPass,
      role: 'user',
    }));
    
    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create halls
    console.log('🏛️  Creating halls...');
    const createdHalls = [];
    for (const hallData of halls) {
      const hall = await Hall.create(hallData);
      createdHalls.push(hall);
      console.log(`   ✓ Created hall: ${hall.name}`);
    }
    console.log(`✅ Created ${createdHalls.length} halls`);

    // Create seats for each hall
    console.log('💺 Creating seats...');
    let totalSeats = 0;
    for (const hall of createdHalls) {
      const seats = generateSeats(hall);
      await Seat.insertMany(seats);
      totalSeats += seats.length;
      console.log(`   ✓ Created ${seats.length} seats for ${hall.name}`);
    }
    console.log(`✅ Created ${totalSeats} total seats`);

    // Create shows
    console.log('🎬 Creating shows...');
    const createdShows = [];
    const now = new Date();
    
    // Create multiple shows per movie across different halls and times
    for (const movie of movies) {
      const numShows = Math.floor(Math.random() * 4) + 3; // 3-6 shows per movie
      
      for (let i = 0; i < numShows; i++) {
        const randomHall = createdHalls[Math.floor(Math.random() * createdHalls.length)];
        
        // Create shows at different times (some past, some upcoming)
        const daysOffset = Math.floor(Math.random() * 21) - 7; // -7 to +14 days
        const hours = [10, 13, 16, 19, 22][Math.floor(Math.random() * 5)];
        const showTime = new Date(now);
        showTime.setDate(showTime.getDate() + daysOffset);
        showTime.setHours(hours, 0, 0, 0);
        
        // Determine status based on time
        let status = 'scheduled';
        if (showTime < now) {
          status = 'completed';
        } else if (Math.random() < 0.05) { // 5% chance of cancellation
          status = 'cancelled';
        }
        
        const show = await Show.create({
          showName: movie.name,
          timing: showTime,
          length: movie.length,
          description: movie.description,
          posterUrl: movie.posterUrl,
          hall: randomHall._id,
          status: status,
        });
        
        createdShows.push(show);
      }
    }
    console.log(`✅ Created ${createdShows.length} shows`);

    // Create tickets (bookings)
    console.log('🎟️  Creating tickets...');
    const completedShows = createdShows.filter(s => s.status === 'completed');
    const upcomingShows = createdShows.filter(s => s.status === 'scheduled');
    
    let ticketCount = 0;
    
    // Create tickets for completed shows (more tickets)
    for (const show of completedShows) {
      const numTickets = Math.floor(Math.random() * 8) + 3; // 3-10 tickets per completed show
      
      for (let i = 0; i < numTickets; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const hallSeats = await Seat.find({ hall: show.hall, isReserved: false });
        
        if (hallSeats.length === 0) continue;
        
        const numSeatsToBook = Math.floor(Math.random() * 4) + 1; // 1-4 seats per ticket
        const seatsToBook = getRandomItems(hallSeats, Math.min(numSeatsToBook, hallSeats.length));
        
        // Calculate total price based on seat types
        const hall = await Hall.findById(show.hall);
        let totalPrice = 0;
        for (const seat of seatsToBook) {
          if (seat.seatType === 'VIP') totalPrice += hall.vipSeatPrice;
          else if (seat.seatType === 'Premium') totalPrice += hall.premiumSeatPrice;
          else totalPrice += hall.normalSeatPrice;
        }
        
        const ticket = await Ticket.create({
          owner: randomUser._id,
          show: show._id,
          hall: show.hall,
          seats: seatsToBook.map(s => s._id),
          totalPrice: totalPrice,
          status: 'completed',
          purchaseDate: new Date(show.timing.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Purchased up to 7 days before show
        });
        
        // Mark seats as reserved
        await Seat.updateMany(
          { _id: { $in: seatsToBook.map(s => s._id) } },
          { isReserved: true }
        );
        
        ticketCount++;
      }
    }
    
    // Create tickets for upcoming shows (fewer tickets)
    for (const show of upcomingShows.slice(0, 30)) { // Only first 30 upcoming shows
      const numTickets = Math.floor(Math.random() * 5) + 1; // 1-5 tickets per upcoming show
      
      for (let i = 0; i < numTickets; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const hallSeats = await Seat.find({ hall: show.hall, isReserved: false });
        
        if (hallSeats.length === 0) continue;
        
        const numSeatsToBook = Math.floor(Math.random() * 3) + 1; // 1-3 seats
        const seatsToBook = getRandomItems(hallSeats, Math.min(numSeatsToBook, hallSeats.length));
        
        const hall = await Hall.findById(show.hall);
        let totalPrice = 0;
        for (const seat of seatsToBook) {
          if (seat.seatType === 'VIP') totalPrice += hall.vipSeatPrice;
          else if (seat.seatType === 'Premium') totalPrice += hall.premiumSeatPrice;
          else totalPrice += hall.normalSeatPrice;
        }
        
        const ticket = await Ticket.create({
          owner: randomUser._id,
          show: show._id,
          hall: show.hall,
          seats: seatsToBook.map(s => s._id),
          totalPrice: totalPrice,
          status: 'confirmed',
        });
        
        await Seat.updateMany(
          { _id: { $in: seatsToBook.map(s => s._id) } },
          { isReserved: true }
        );
        
        ticketCount++;
      }
    }
    
    console.log(`✅ Created ${ticketCount} tickets`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Users: ${createdUsers.length + 1} (including admin)`);
    console.log(`🏛️  Halls: ${createdHalls.length}`);
    console.log(`💺 Seats: ${totalSeats}`);
    console.log(`🎬 Shows: ${createdShows.length}`);
    console.log(`🎟️  Tickets: ${ticketCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Admin Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n👥 Sample User Credentials:');
    console.log(`   Email: john.smith@example.com`);
    console.log(`   Password: password123`);
    console.log('\n✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
};

// Run the seed function
seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
