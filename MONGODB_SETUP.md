# MongoDB Setup Guide

This application uses MongoDB for persistent data storage. Follow these instructions to set up MongoDB.

## Option 1: Local MongoDB Installation

### Windows

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Windows installer (.msi)

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool) when prompted

3. **Verify Installation**
   ```powershell
   # Check if MongoDB is running
   Get-Service mongodb
   
   # Or connect to MongoDB
   mongo
   ```

4. **Start/Stop MongoDB Service**
   ```powershell
   # Start
   net start MongoDB
   
   # Stop
   net stop MongoDB
   ```

### macOS

1. **Install using Homebrew**
   ```bash
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   # Start as a service
   brew services start mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

### Linux (Ubuntu/Debian)

1. **Install MongoDB**
   ```bash
   # Import public key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   
   # Add repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   
   # Install
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Start on boot
   ```

## Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Configure Access**
   - Go to "Database Access" → Add New Database User
   - Create username and password
   - Go to "Network Access" → Add IP Address
   - Add your current IP or use `0.0.0.0/0` (allows all - less secure)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-finder?retryWrites=true&w=majority
   ```

## Option 3: Docker

1. **Run MongoDB in Docker**
   ```bash
   docker run -d \
     --name mongodb \
     -p 27017:27017 \
     -v mongodb_data:/data/db \
     mongo:latest
   ```

2. **Stop/Start Container**
   ```bash
   docker stop mongodb
   docker start mongodb
   ```

## Configuration

### Environment Variables

Edit `.env` file in the project root:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/event-finder

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-finder

# Docker
MONGODB_URI=mongodb://localhost:27017/event-finder
```

### Database Name

The default database name is `event-finder`. You can change it in the connection string:
- Local: `mongodb://localhost:27017/YOUR_DB_NAME`
- Atlas: `...mongodb.net/YOUR_DB_NAME...`

## Verify Connection

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Check terminal output**
   You should see:
   ```
   ✅ Connected to MongoDB successfully
   📊 Database: event-finder
   ```

## MongoDB Compass (GUI Tool)

MongoDB Compass provides a visual interface for your database.

1. **Open MongoDB Compass**
   - Windows: Start menu → MongoDB Compass
   - macOS: Applications → MongoDB Compass

2. **Connect**
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Data**
   - Database: `event-finder`
   - Collection: `events`

## Troubleshooting

### Connection Refused

**Problem**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:
1. Make sure MongoDB is running:
   ```bash
   # Windows
   Get-Service mongodb
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. Check MongoDB port (default: 27017):
   ```bash
   netstat -an | findstr "27017"
   ```

3. Restart MongoDB service

### Authentication Failed

**Problem**: `MongoServerError: Authentication failed`

**Solutions**:
1. Check username and password in connection string
2. Verify user exists in database
3. Check database name in connection string

### Network Timeout (Atlas)

**Problem**: Connection times out with Atlas

**Solutions**:
1. Check IP whitelist in Atlas → Network Access
2. Add your current IP address
3. Check firewall settings

### Collection Not Found

**Problem**: No data showing up

**Solution**: The application automatically seeds sample data on first run. If not:
```bash
# Stop the server and restart
npm run dev
```

## Database Structure

### Collections

#### events
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  date: Date,
  maxParticipants: Number,
  currentParticipants: Number,
  latitude: Number (optional),
  longitude: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

The application creates indexes for better query performance:
- Text index on `title` and `description`
- Index on `location`
- Index on `date`

## Useful MongoDB Commands

```bash
# Connect to MongoDB shell
mongo

# Or with mongosh (new shell)
mongosh

# Show databases
show dbs

# Use database
use event-finder

# Show collections
show collections

# View all events
db.events.find().pretty()

# Count events
db.events.countDocuments()

# Delete all events
db.events.deleteMany({})

# Drop database
use event-finder
db.dropDatabase()
```

## Backup and Restore

### Backup
```bash
# Backup entire database
mongodump --db=event-finder --out=./backup

# Backup specific collection
mongodump --db=event-finder --collection=events --out=./backup
```

### Restore
```bash
# Restore entire database
mongorestore --db=event-finder ./backup/event-finder

# Restore specific collection
mongorestore --db=event-finder --collection=events ./backup/event-finder/events.bson
```

## MongoDB Atlas Additional Features

- **Monitoring**: Real-time performance metrics
- **Backups**: Automatic backups (paid tiers)
- **Alerts**: Email notifications for issues
- **Charts**: Data visualization (separate service)

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
