# Coding Club Backend - TypeScript

Coding Club Portfolio website with PostgreSQL database, GitHub OAuth authentication, and role-based access control.

## Features

- ✅ GitHub OAuth Authentication (Free)
- ✅ PostgreSQL Database with Prisma ORM
- ✅ Role-Based Access Control (Admin, Member, Pending)
- ✅ RESTful API
- ✅ Member Management
- ✅ Project Management with Approval System
- ✅ Event Management with Featured Events
- ✅ Skills & Tags System
- ✅ Admin Dashboard Functionality

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + GitHub OAuth

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory(or rename `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/coding_club_db?schema=public"
PORT=5000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback

FRONTEND_URL=http://localhost:3000

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_NOTIFICATION_EMAIL=
```

### 3. GitHub OAuth Setup (FREE)

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

**Note**: GitHub OAuth is completely free for both public and private repositories!

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 5. Generate VAPID Keys
```bash
# Generate public and private keys
npx web-push generate-vapid-keys
```

Add the keys to `.env`

### 5. Run the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/auth/me` - Get current user
- `GET /api/auth/github/repos` - Fetch user's GitHub repos

### Members
- `GET /api/members` - Get all members (with filters)
- `GET /api/members/leads` - Get club leads
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/profile` - Update own profile (Auth)
- `POST /api/members/skills` - Add skills (Auth)
- `DELETE /api/members/skills/:skillId` - Remove skill (Auth)

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe to push notifications

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Auth)
- `PUT /api/projects/:id` - Update project (Auth)
- `DELETE /api/projects/:id` - Delete project (Auth)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag (Admin)
- `DELETE /api/tags/:id` - Delete tag (Admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Auth)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Admin
- `GET /api/admin/members/pending` - Get pending member approvals
- `PUT /api/admin/members/:userId/approve` - Approve/reject member
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `GET /api/admin/projects/pending` - Get pending projects
- `PUT /api/admin/projects/:projectId/approve` - Approve/reject project
- `DELETE /api/admin/projects/:projectId` - Remove project
- `PUT /api/admin/events/:eventId/featured` - Set event as featured
- `POST /api/notifications/send` - Send push notifications to targeted users or broadcast gloablly

## Database Schema

### User
- GitHub authentication
- Role: ADMIN, MEMBER, PENDING
- Active status
- Lead status

### Member
- Profile information
- Bio, role title, dev stack
- Skills (many-to-many)
- Projects (one-to-many)

### Push Subscription
- Subscription information

### Project
- Title, description
- GitHub/Live URLs
- Category: WEB, AI, UIUX
- Approval system
- Tags (many-to-many)

### Event
- Event details
- Date and location
- Featured flag
- Upcoming flag

### Skill & Tag
- Name and category
- Used for filtering

## Role-Based Access

### Public (No Auth)
- View approved members
- View approved projects
- View events

### Member (Authenticated)
- Update own profile
- Create/edit own projects
- View pending approval status

### Admin
- Approve/reject members
- Approve/reject projects
- Manage all content
- Set featured events
- Manage skills & tags
- Send push notifications

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Auth & error middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point

prisma/
└── schema.prisma    # Database schema
```

## Development Notes

- First user needs to be manually set as ADMIN in database
- Projects require admin approval by default
- Members are PENDING until approved by admin
- GitHub OAuth automatically creates user + member profile

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database URL
4. Update `FRONTEND_URL` and GitHub OAuth URLs
5. Run migrations: `npx prisma migrate deploy`
6. Build: `npm run build`
7. Start: `npm start`

## License

