export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: "mongodb+srv://harman:harman@ticketbook.oxlckbw.mongodb.net/?retryWrites=true&w=majority&appName=ticketBook",
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'],
  apiPrefix: process.env.API_PREFIX || '/api',
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  cloudinary: {
    cloudName: 'dj92yahod',
    apiKey: '545176873795481',
    apiSecret: 'F1A9nmXPL1WeJERp2pJQUAJAvxI',
  },
}
// };
// export const validateConfig = () => {
//   const hasDbUri = process.env.DB_URL || process.env.MONGO_URI;
//   const missing = [];
//   if (!hasDbUri) {
//     missing.push('Database URI (DB_URL or MONGO_URI)');
//   }
//   if (!process.env.JWT_SECRET) {
//     missing.push('JWT_SECRET');
//   }
//   if (missing.length > 0) {
//     if (config.nodeEnv === 'production') {
//       console.error('❌ CRITICAL ERROR: Missing required environment variables');
//       missing.forEach(key => console.error(`   - ${key}`));
//       throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
//     } else {
//       console.warn('⚠️  WARNING: Missing environment variables (using defaults)');
//       missing.forEach(key => console.warn(`   - ${key}`));
//     }
//   } else if (config.nodeEnv === 'development') {
//     const dbSource = process.env.DB_URL ? 'DB_URL' : 'MONGO_URI';
//     console.log(`✅ Configuration validated successfully (Database: ${dbSource})`);
//   }
//   if (config.cloudinary.cloudName &&
//     (!config.cloudinary.apiKey || !config.cloudinary.apiSecret)) {
//     console.warn('⚠️  WARNING: Incomplete Cloudinary configuration. Image uploads may not work.');
//   }

//   if (config.nodeEnv === 'development') {
//     console.log('✅ Configuration validated successfully');
//   }
// };
