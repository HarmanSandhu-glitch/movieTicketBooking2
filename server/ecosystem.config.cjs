module.exports = {
  apps: [
    {
      name: 'movie-ticket-server',
      script: 'server.js',
      instances: process.env.NODE_ENV === 'production' ? 2 : 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000,
        // PM2 will inherit all environment variables from .env
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: process.env.PORT || 5001
      }
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/movie-ticket-booking.git',
      path: '/var/www/production',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
