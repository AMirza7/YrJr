# YRJR Legal Assistant - Backend Integration Guide

## Overview

This guide provides comprehensive instructions for integrating the YRJR Legal Assistant React Native frontend with your backend infrastructure.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints Mapping](#api-endpoints-mapping)
3. [Authentication Integration](#authentication-integration)
4. [Data Models](#data-models)
5. [File Upload & Storage](#file-upload--storage)
6. [Real-time Features](#real-time-features)
7. [Environment Configuration](#environment-configuration)
8. [Security Considerations](#security-considerations)
9. [Deployment Guide](#deployment-guide)

## Architecture Overview

### Frontend Structure

```
app/
├── (tabs)/          # Main authenticated user interface
├── auth/            # Authentication screens
├── components/      # Reusable UI components
├── services/        # API service layers
├── contexts/        # React context providers
├── types/           # TypeScript type definitions
└── constants/       # App constants and configurations
```

### Backend Requirements

- REST API endpoints (or GraphQL)
- Authentication system (JWT recommended)
- File storage system (AWS S3, Google Cloud, etc.)
- Real-time capabilities (WebSocket/Socket.io)
- Database (PostgreSQL, MongoDB, etc.)

## API Endpoints Mapping

### Authentication Endpoints

```typescript
// Required backend endpoints for auth functionality

POST / api / auth / register;
POST / api / auth / login;
POST / api / auth / logout;
POST / api / auth / refresh - token;
POST / api / auth / forgot - password;
POST / api / auth / reset - password;
POST / api / auth / verify - email;
POST / api / auth / verify - phone;
GET / api / auth / profile;
PUT / api / auth / profile;
```

### User Management

```typescript
GET / api / users / profile;
PUT / api / users / profile;
GET / api / users / preferences;
PUT / api / users / preferences;
POST / api / users / upload - avatar;
```

### Core Features

```typescript
// Legal Pinboard
GET    /api/pinboard
POST   /api/pinboard
PUT    /api/pinboard/:id
DELETE /api/pinboard/:id
GET    /api/pinboard/:id/comments

// Case Timeline
GET    /api/cases
POST   /api/cases
PUT    /api/cases/:id
DELETE /api/cases/:id
GET    /api/cases/:id/timeline
POST   /api/cases/:id/events

// Secure Notes
GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id

// Templates
GET    /api/templates
GET    /api/templates/:id
POST   /api/templates/download/:id

// AI Comparator
POST   /api/ai/compare
GET    /api/ai/comparison/:id

// Document Scanner
POST   /api/documents/scan
POST   /api/documents/ocr

// Search
GET    /api/search/legal
POST   /api/search/voice

// Flashcards
GET    /api/flashcards
POST   /api/flashcards
PUT    /api/flashcards/:id
DELETE /api/flashcards/:id
GET    /api/flashcards/sets
```

### Admin Endpoints

```typescript
GET    /api/admin/stats
GET    /api/admin/users
PUT    /api/admin/users/:id/approve
PUT    /api/admin/users/:id/reject
GET    /api/admin/pending-approvals
GET    /api/admin/analytics
```

## Authentication Integration

### JWT Token Management

The app uses JWT tokens stored securely:

```typescript
// services/auth.ts integration points
interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
}

// Backend should return this structure
const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

### Token Storage

- **Mobile**: Uses @react-native-async-storage/async-storage
- **Web**: Uses localStorage with fallback to sessionStorage
- **Security**: Tokens are automatically attached to API requests

### Role-Based Access Control

```typescript
// Backend should implement role checking
enum UserRole {
  LAWYER = "lawyer",
  JUNIOR_LAWYER = "junior_lawyer",
  LAWYER_ASSISTANT = "lawyer_assistant",
  LAW_OFFICE_HELPER = "law_office_helper",
  LAW_STUDENT = "law_student",
  ADMIN = "admin",
}

// Middleware example for backend
const requireRole = (roles: UserRole[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
```

## Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isApproved: boolean;
  subscriptionTier: "free" | "pro" | "premium";
  profilePicture?: string;
  specialization?: string[];
  practiceYears?: number;
  barCouncilNumber?: string;
  officeAddress?: string;
  preferences: UserPreferences;
  createdAt: string;
  lastActiveAt: string;
}
```

### Pinboard Item Model

```typescript
interface PinboardItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category:
    | "case"
    | "research"
    | "deadline"
    | "meeting"
    | "document"
    | "reminder";
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  attachments: FileAttachment[];
  dueDate?: string;
  isCompleted: boolean;
  reminders: Reminder[];
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Case Timeline Model

```typescript
interface CaseTimeline {
  id: string;
  userId: string;
  caseNumber: string;
  title: string;
  description: string;
  status: "active" | "pending" | "closed" | "on_hold";
  courtName: string;
  judgeDetails?: string;
  nextHearing?: string;
  events: TimelineEvent[];
  documents: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}
```

## File Upload & Storage

### File Upload Implementation

```typescript
// Frontend sends files via FormData
const uploadFile = async (
  file: File | Blob,
  type: "document" | "avatar" | "attachment",
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

### Backend File Handling

```typescript
// Expected response format
interface FileUploadResponse {
  success: boolean;
  file?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  error?: string;
}
```

### Storage Recommendations

- **Documents**: AWS S3, Google Cloud Storage, or Azure Blob
- **Avatars**: CDN with image optimization
- **Temporary files**: Local storage with cleanup jobs
- **Security**: Signed URLs for private documents

## Real-time Features

### WebSocket Implementation

```typescript
// Real-time notifications and updates
const connectWebSocket = (userId: string, token: string) => {
  const ws = new WebSocket(`wss://api.yourbackend.com/ws?token=${token}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleRealTimeUpdate(data);
  };
};

// Message types to handle
interface WebSocketMessage {
  type: "notification" | "case_update" | "comment" | "reminder";
  data: any;
  userId: string;
  timestamp: string;
}
```

### Push Notifications

```typescript
// Integration with Expo Push Notifications
POST / api / notifications / register - token;
POST / api / notifications / send;
GET / api / notifications / history;
PUT / api / notifications / mark - read;
```

## Environment Configuration

### Frontend Environment Variables

```typescript
// app.config.js or .env file
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || "http://localhost:3000/api",
      wsUrl: process.env.WS_URL || "ws://localhost:3000",
      uploadUrl: process.env.UPLOAD_URL || "http://localhost:3000/upload",
      apiKey: process.env.API_KEY,
      environment: process.env.NODE_ENV || "development",
    },
  },
};
```

### Backend Configuration

```typescript
// Required environment variables for backend
const config = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
```

## Security Considerations

### API Security

```typescript
// Required security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
});

// Rate limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);
```

### Data Validation

```typescript
// Use Joi, Yup, or similar validation library
const userValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
});
```

### Encryption

- **Passwords**: bcrypt with salt rounds ≥ 12
- **Sensitive data**: AES-256 encryption
- **Secure notes**: Client-side encryption before storage
- **File uploads**: Virus scanning before storage

## Deployment Guide

### Backend Deployment Checklist

```bash
# 1. Environment setup
✓ Set all required environment variables
✓ Configure database connection
✓ Set up file storage (S3, etc.)
✓ Configure SMTP for emails
✓ Set up SSL certificates

# 2. Database setup
✓ Run migrations
✓ Seed initial data
✓ Set up backup strategy
✓ Configure connection pooling

# 3. Security
✓ Enable CORS for frontend domains
✓ Set up rate limiting
✓ Configure firewall rules
✓ Enable request logging

# 4. Monitoring
✓ Set up error tracking (Sentry, etc.)
✓ Configure health checks
✓ Set up log aggregation
✓ Monitor performance metrics
```

### Frontend Deployment

```bash
# Expo/React Native deployment
expo build:web          # For web deployment
expo build:android      # For Android APK/AAB
expo build:ios          # For iOS IPA

# Environment-specific builds
NODE_ENV=production expo build:web
```

### Database Schema Examples

#### Users Table (PostgreSQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    subscription_tier subscription_tier_enum DEFAULT 'free',
    profile_picture TEXT,
    specialization TEXT[],
    practice_years INTEGER,
    bar_council_number VARCHAR(100),
    office_address TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW()
);
```

#### Pinboard Items Table

```sql
CREATE TABLE pinboard_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category pinboard_category_enum NOT NULL,
    priority priority_enum DEFAULT 'medium',
    tags TEXT[],
    due_date TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    shared_with UUID[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Response Format Standardization

```typescript
// Consistent API response format
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Usage example
app.get("/api/users", async (req, res) => {
  try {
    const users = await getUsersWithPagination(req.query);
    res.json({
      success: true,
      data: users.items,
      pagination: users.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "USERS_FETCH_ERROR",
        message: "Failed to fetch users",
        details: error.message,
      },
    });
  }
});
```

## Testing Integration

### Backend API Testing

```typescript
// Example test for authentication
describe("Authentication API", () => {
  test("POST /api/auth/login - successful login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });
});
```

### Frontend Integration Testing

```typescript
// Test API service integration
import { authService } from "../services/auth";

describe("Auth Service", () => {
  test("login should return user data on success", async () => {
    const result = await authService.login("test@example.com", "password123");
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });
});
```

## Performance Optimization

### Backend Optimization

```typescript
// Database query optimization
const getPinboardItems = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  return await db.query(
    `
    SELECT p.*, 
           COALESCE(c.comment_count, 0) as comment_count,
           COALESCE(a.attachment_count, 0) as attachment_count
    FROM pinboard_items p
    LEFT JOIN (
      SELECT pinboard_id, COUNT(*) as comment_count 
      FROM comments 
      GROUP BY pinboard_id
    ) c ON p.id = c.pinboard_id
    LEFT JOIN (
      SELECT pinboard_id, COUNT(*) as attachment_count 
      FROM attachments 
      GROUP BY pinboard_id
    ) a ON p.id = a.pinboard_id
    WHERE p.user_id = $1
    ORDER BY p.updated_at DESC
    LIMIT $2 OFFSET $3
  `,
    [userId, limit, (page - 1) * limit],
  );
};
```

### Caching Strategy

```typescript
// Redis caching for frequently accessed data
const redis = require("redis");
const client = redis.createClient();

const getCachedUserProfile = async (userId: string) => {
  const cached = await client.get(`user_profile:${userId}`);
  if (cached) return JSON.parse(cached);

  const profile = await getUserProfile(userId);
  await client.setex(`user_profile:${userId}`, 300, JSON.stringify(profile)); // 5 min cache
  return profile;
};
```

## Monitoring and Analytics

### Error Tracking

```typescript
// Integration with Sentry or similar
const Sentry = require("@sentry/node");

app.use(Sentry.Handlers.errorHandler());

// Custom error tracking for API endpoints
const trackAPIError = (endpoint: string, error: Error, userId?: string) => {
  Sentry.withScope((scope) => {
    scope.setTag("api_endpoint", endpoint);
    scope.setUser({ id: userId });
    Sentry.captureException(error);
  });
};
```

### Usage Analytics

```typescript
// Track feature usage
const trackFeatureUsage = async (
  userId: string,
  feature: string,
  metadata?: any,
) => {
  await db.query(
    `
    INSERT INTO feature_usage (user_id, feature, metadata, timestamp)
    VALUES ($1, $2, $3, NOW())
  `,
    [userId, feature, JSON.stringify(metadata)],
  );
};
```

---

## Quick Start Checklist

### For Backend Developers:

1. ✅ Set up the required API endpoints listed above
2. ✅ Implement JWT authentication with refresh tokens
3. ✅ Create database schema based on TypeScript interfaces
4. ✅ Set up file upload handling with proper security
5. ✅ Implement role-based access control
6. ✅ Add input validation and error handling
7. ✅ Set up WebSocket for real-time features
8. ✅ Configure CORS for frontend domains
9. ✅ Add rate limiting and security headers
10. ✅ Set up monitoring and logging

### For Frontend Integration:

1. ✅ Update `config/env.ts` with your API endpoints
2. ✅ Modify `services/auth.ts` to match your auth flow
3. ✅ Update API service files in `services/` directory
4. ✅ Configure push notification tokens
5. ✅ Test all user flows with your backend
6. ✅ Update error handling for your API responses
7. ✅ Configure file upload endpoints
8. ✅ Test real-time features
9. ✅ Verify role-based UI hiding works with your roles
10. ✅ Test on both web and mobile platforms

## Support

For integration support or questions:

- 📧 Email: backend-support@yrjr.app
- 📱 Phone: +91-1234567890
- 📖 Documentation: [API Docs](https://docs.yrjr.app)
- 💬 Discord: [Developer Community](https://discord.gg/yrjr-dev)

---

_This guide is maintained and updated regularly. Last updated: December 2024_
