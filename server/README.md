# Movie Ticket Booking System - Server Structure

## 📁 Project Structure

```
server/
├── configs/           # Configuration files
│   ├── db.js         # Database connection
│   └── config.js     # Environment configuration
├── controllers/       # Request handlers
│   ├── hall_controllers/
│   ├── seat_controllers/
│   ├── show_controllers/
│   ├── ticket_controllers/
│   └── user_controllers/
├── middlewares/       # Custom middleware
│   └── authMiddleware.js
├── models/           # Database models
│   ├── hall_model.js
│   ├── seat_model.js
│   ├── show_model.js
│   ├── ticket_model.js
│   └── user_model.js
├── routes/           # API routes
│   ├── index.js      # Main router
│   ├── hall_routes.js
│   ├── seat_routes.js
│   ├── show_routes.js
│   ├── ticket_routes.js
│   └── user_routes.js
├── utils/            # Utility functions
│   ├── apiResponse.js    # Standardized API responses
│   ├── constants.js      # Application constants
│   ├── errorHandler.js   # Error handling utilities
│   └── validation.js     # Validation helpers
└── server.js         # Application entry point
```

## 🎯 Key Improvements

### 1. **Consistent API Response Format**
All API responses now follow a standardized format:
```json
{
  "success": true/false,
  "message": "Success message",
  "data": { ... }
}
```

### 2. **Centralized Error Handling**
- Custom error classes (`AppError`, `ValidationError`, `NotFoundError`, etc.)
- `asyncHandler` wrapper for async route handlers
- Global error handling middleware

### 3. **Validation Utilities**
- ObjectId validation
- Required field validation
- Email validation
- Number validation with min/max
- Enum validation

### 4. **Route Organization**
- Static routes defined before dynamic routes (prevents conflicts)
- Grouped by resource type
- Consistent naming conventions

### 5. **Configuration Management**
- Centralized environment configuration
- Config validation
- Default values for development

## 🚀 API Endpoints

### Authentication
- `POST /api/users/signin` - User sign in
- `POST /api/users/signup` - User sign up
- `PUT /api/users/profile/:id` - Update user profile

### Halls
- `POST /api/halls/create` - Create hall (Admin)
- `GET /api/halls/all` - Get all halls
- `GET /api/halls/:id` - Get hall by ID
- `GET /api/halls/:id/shows` - Get shows for hall
- `PUT /api/halls/:id/update` - Update hall (Admin)
- `DELETE /api/halls/:id/delete` - Delete hall (Admin)

### Shows
- `POST /api/shows/create` - Create show (Admin)
- `GET /api/shows/all` - Get all shows
- `GET /api/shows/:id` - Get show by ID
- `PUT /api/shows/:id/update` - Update show (Admin)
- `DELETE /api/shows/:id/delete` - Delete show (Admin)

### Seats
- `GET /api/seats/hall/:hallId` - Get all seats for hall
- `POST /api/seats/hall/:hallId/create` - Create seats for hall
- `GET /api/seats/:seatId/:showId` - Get seat status for show
- `GET /api/seats/:id` - Get seat by ID

### Tickets
- `POST /api/tickets/generate` - Generate/book ticket
- `GET /api/tickets/all` - Get all tickets
- `GET /api/tickets/user/:userId` - Get user tickets
- `PUT /api/tickets/:id/update-status` - Update ticket status

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/movie-ticket-booking
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## 📝 Code Conventions

### Controllers
- Use `asyncHandler` wrapper for all async controllers
- Use standardized response utilities (`successResponse`, `errorResponse`, etc.)
- Validate inputs using validation utilities
- Handle errors appropriately

### Routes
- Define static routes before dynamic routes
- Use consistent naming (plural resource names)
- Apply middleware in order: `isAuth`, then `isAdmin`
- Group related routes together

### Models
- Use clear, descriptive field names
- Add validation at schema level
- Include timestamps
- Use appropriate indexes

## 🧪 Testing

(To be implemented)
- Unit tests for controllers
- Integration tests for routes
- Model validation tests

## 📊 Database Schema

### User
- email, password, name, role (user/admin)

### Hall
- name, location, seating capacities, seat prices

### Seat
- hall reference, seatNo, seatType, isAvailable

### Show
- showName, hall reference, timing, length, description, status

### Ticket
- owner, show, hall, seats, totalPrice, status

## 🔐 Authentication & Authorization

- JWT-based authentication
- Cookie-based token storage
- Role-based access control (User/Admin)
- Protected routes using middleware

## 🎨 Best Practices

1. **Separation of Concerns**: Controllers, routes, models, and utilities are clearly separated
2. **DRY Principle**: Reusable utilities and middleware
3. **Error Handling**: Consistent error handling across the application
4. **Input Validation**: Validation at multiple levels (schema, controller)
5. **Security**: Authentication, authorization, input sanitization
6. **Maintainability**: Clear structure, consistent naming, documentation

## 📈 Future Enhancements

- [ ] Add request rate limiting
- [ ] Implement caching (Redis)
- [ ] Add API versioning
- [ ] Implement pagination for list endpoints
- [ ] Add search and filter capabilities
- [ ] Implement file upload for movie posters
- [ ] Add email notifications
- [ ] Implement payment gateway integration
- [ ] Add logging service (Winston)
- [ ] Create API documentation (Swagger/OpenAPI)
