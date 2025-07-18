# LostFound Backend API

Backend server for the LostFound Smart Campus Lost & Found Portal.

## Features

- User authentication (JWT-based)
- Lost and found item management
- Smart matching algorithm
- File upload support
- Statistics and analytics
- SQLite database
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (with better-sqlite3)
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Items
- `GET /api/items` - Get all items (with filters)
- `POST /api/items` - Create new item (protected)
- `GET /api/items/:id` - Get single item
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `GET /api/items/recent` - Get recent items
- `GET /api/items/search/:term` - Search items

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/item/:id` - Get matches for item
- `PUT /api/matches/:id/status` - Update match status (protected)
- `DELETE /api/matches/:id` - Delete match (protected)
- `GET /api/matches/stats` - Get match statistics

### User
- `GET /api/user/items` - Get user's items (protected)
- `GET /api/user/items/:type` - Get user's items by type (protected)
- `GET /api/user/stats` - Get user statistics (protected)

### Statistics
- `GET /api/stats` - Get overall statistics
- `GET /api/stats/category/:category` - Get category statistics
- `GET /api/stats/location/:location` - Get location statistics
- `GET /api/stats/daily` - Get daily statistics

## Database Schema

### Users
- id (Primary Key)
- name
- email (Unique)
- student_id (Unique)
- phone
- password_hash
- created_at
- updated_at

### Items
- id (Primary Key)
- user_id (Foreign Key)
- type (lost/found)
- name
- description
- category
- location
- date_occurred
- contact
- image_path
- status (active/matched/resolved)
- created_at
- updated_at

### Matches
- id (Primary Key)
- lost_item_id (Foreign Key)
- found_item_id (Foreign Key)
- match_score
- status (pending/confirmed/rejected)
- created_at

## Matching Algorithm

The smart matching algorithm considers:
- **Category Match** (40 points) - Same category
- **Location Similarity** (20 points) - Same or similar location
- **Name Similarity** (25 points) - Text similarity using Jaccard index
- **Description Similarity** (15 points) - Text similarity using Jaccard index

Minimum match score: 30/100

## Environment Variables

```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
DB_PATH=./database.sqlite
UPLOAD_DIR=./uploads
```

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Security Features

- Helmet.js for security headers
- Rate limiting
- CORS configuration
- Input validation
- File upload restrictions
- JWT token expiration
