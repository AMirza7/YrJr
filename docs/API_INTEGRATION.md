# YrJr Legal Assistant - API Integration Guide

## Overview

This document provides a comprehensive guide for the backend API integration layer implemented for the YrJr Legal Assistant app. The system includes a complete service layer, custom hooks, token management, and mock implementations for development.

## Architecture

### 1. HTTP Client (`services/httpClient.ts`)

- **Axios-based HTTP client** with automatic token management
- **Automatic token refresh** on 401 errors
- **Request/Response interceptors** for logging and error handling
- **Token storage** using AsyncStorage with expiry checking
- **File upload support** with progress tracking

```typescript
// Basic usage
import { httpClient } from "@/services/httpClient";

const response = await httpClient.get<UserData>("/user/profile");
```

### 2. Environment Configuration (`config/env.ts`)

- **Type-safe configuration** with fallbacks
- **Feature flags** for enabling/disabling functionality
- **Environment validation** for production readiness
- **Multi-language and regional settings**

```typescript
import { Config, FeatureFlags } from "@/config/env";

// Check if AI assistant is enabled
if (FeatureFlags.isEnabled("ENABLE_AI_ASSISTANT")) {
  // Initialize AI features
}
```

### 3. API Services Layer

#### Authentication API (`services/api/authApi.ts`)

- Login/Register with email and password
- OTP sending and verification (SMS/Email)
- Profile management and updates
- Password change and reset
- Biometric token handling

```typescript
import AuthApiService from "@/services/api/authApi";

// Login
const loginResult = await AuthApiService.login({
  email: "user@example.com",
  password: "password123",
});

// Send OTP
await AuthApiService.sendOTP({
  phone: "+91 9876543210",
  type: "sms",
});
```

#### Court Orders API (`services/api/courtOrdersApi.ts`)

- Fetch court orders with advanced filtering
- Search functionality with debouncing
- Bookmark management
- Document downloads
- Statistics and analytics

```typescript
import CourtOrdersApiService from "@/services/api/courtOrdersApi";

// Get court orders with filters
const orders = await CourtOrdersApiService.getCourtOrders({
  search: "criminal case",
  orderType: "JUDGMENT",
  page: 1,
  limit: 20,
});
```

#### Messages API (`services/api/messagesApi.ts`)

- Conversation management
- Real-time messaging
- File attachments and media
- Message reactions and editing
- Search across conversations

```typescript
import MessagesApiService from "@/services/api/messagesApi";

// Send a message
await MessagesApiService.sendMessage({
  conversationId: "conv_123",
  content: "Hello, how can I help you?",
  messageType: "text",
});
```

#### Lawyers Directory API (`services/api/lawyersApi.ts`)

- Lawyer search with filters
- Ratings and reviews system
- Consultation booking
- Availability checking
- Specialization filtering

```typescript
import LawyersApiService from "@/services/api/lawyersApi";

// Search lawyers
const lawyers = await LawyersApiService.getLawyers({
  specializations: ["Criminal Law"],
  location: { city: "Delhi" },
  rating: { min: 4.0 },
});
```

### 4. Custom API Hooks (`hooks/useApiHooks.ts`)

#### Basic API Hook

```typescript
import { useCourtOrders } from '@/hooks/useApiHooks';

const MyComponent = () => {
  const { data, loading, error, refetch } = useCourtOrders({
    search: 'criminal',
    page: 1
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return <CourtOrdersList orders={data} />;
};
```

#### Mutation Hook

```typescript
import { useLogin } from "@/hooks/useApiHooks";

const LoginForm = () => {
  const {
    mutate: login,
    loading,
    error,
  } = useLogin({
    onSuccess: (data) => {
      // Navigate to dashboard
      router.push("/(main)/(tabs)/home");
    },
  });

  const handleSubmit = async () => {
    await login({ email, password });
  };
};
```

#### Paginated Hook

```typescript
import { useLawyers } from '@/hooks/useApiHooks';

const LawyersDirectory = () => {
  const {
    data,
    loading,
    pagination,
    loadMore,
    refresh
  } = useLawyers();

  return (
    <FlatList
      data={data}
      onEndReached={loadMore}
      refreshing={loading}
      onRefresh={refresh}
    />
  );
};
```

#### Search Hook with Debouncing

```typescript
import { useSearchCourtOrders } from '@/hooks/useApiHooks';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { data, loading } = useSearchCourtOrders(query, {
    delay: 500,
    minLength: 3
  });

  return (
    <SearchBar
      value={query}
      onChangeText={setQuery}
      results={data}
      loading={loading}
    />
  );
};
```

## Mock Implementation

All API services include comprehensive mock implementations for development:

```typescript
// Enable/disable mocks via environment
Config.ENABLE_API_MOCKS = true; // Set to false for production

// Mock delay configuration
Config.MOCK_API_DELAY = 1000; // Milliseconds
```

### Mock Data Features:

- **Realistic legal data** with Indian legal system specifics
- **Proper error simulation** for testing error states
- **Pagination support** for list endpoints
- **Search functionality** with filtering
- **File upload simulation** with progress

## Token Management

### Automatic Token Refresh

```typescript
// Tokens are automatically refreshed on 401 errors
// No manual intervention required

// Check authentication status
const isAuthenticated = await httpClient.isAuthenticated();
```

### Manual Token Management

```typescript
import { httpClient } from "@/services/httpClient";

// Set tokens (usually after login)
await httpClient.setAuthTokens(accessToken, refreshToken, expiresIn);

// Clear tokens (during logout)
await httpClient.clearAuthTokens();

// Get current access token
const token = await httpClient.getAccessToken();
```

## Environment Variables

Create `.env` file with required configuration:

```bash
# API Configuration
API_BASE_URL=https://api.yrjr.app/v1
API_TIMEOUT=30000

# Feature Flags
ENABLE_AI_ASSISTANT=true
ENABLE_BIOMETRIC_AUTH=true
ENABLE_API_MOCKS=true

# Development
MOCK_API_DELAY=1000
LOG_LEVEL=debug
```

## Production Integration Steps

### 1. Update API Base URL

```typescript
// In .env or config
API_BASE_URL=https://production-api.yrjr.app/v1
ENABLE_API_MOCKS=false
```

### 2. Replace Mock Services

- Update service methods to remove mock conditions
- Implement real API endpoint calls
- Add proper error handling

### 3. Token Management

- Configure JWT secret and expiry
- Set up refresh token rotation
- Implement proper logout on token expiry

### 4. File Uploads

- Configure multipart form data handling
- Implement progress tracking
- Add file size and type validation

## Error Handling

### Global Error Handling

```typescript
// HTTP client automatically normalizes errors
// All API hooks receive consistent error format

const { error } = useCourtOrders();
if (error) {
  // error is always a string message
  console.log(error); // "Network error occurred"
}
```

### Custom Error Handling

```typescript
const { mutate } = useLogin({
  onError: (error, variables) => {
    if (error.includes("Invalid credentials")) {
      // Show specific error message
    } else {
      // Show generic error
    }
  },
});
```

## Performance Optimizations

### Request Caching

```typescript
// Implement using React Query or SWR
import { useApi } from "@/hooks/useApi";

const { data } = useApi(() => CourtOrdersApiService.getCourtOrders(), {
  // Add caching options
  dependencies: [filters], // Re-fetch when filters change
});
```

### Debounced Search

```typescript
// Built-in debouncing for search
const { data } = useSearchCourtOrders(query, {
  delay: 500, // Wait 500ms after user stops typing
  minLength: 3, // Don't search until 3 characters
});
```

### Pagination

```typescript
// Efficient pagination with load more
const { data, loadMore, hasMore } = usePaginatedApi(apiFunction);

// Load more data
if (hasMore) {
  await loadMore();
}
```

## Testing

### Mock Data Testing

```typescript
// All services work with mocks enabled
Config.ENABLE_API_MOCKS = true;

// Test different scenarios
const orders = await CourtOrdersApiService.getCourtOrders({
  search: "nonexistent", // Returns empty array
  page: 999, // Returns empty results
});
```

### Error Simulation

```typescript
// Mock services simulate various error conditions
// 401 errors trigger automatic token refresh
// Network errors are properly handled
```

## API Endpoints Reference

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

### Court Orders

- `GET /court-orders` - List court orders
- `GET /court-orders/:id` - Get single order
- `POST /court-orders/search` - Search orders
- `POST /court-orders/:id/bookmark` - Toggle bookmark
- `GET /court-orders/bookmarks` - Get bookmarked orders

### Messages

- `GET /messages/conversations` - List conversations
- `GET /messages/conversations/:id/messages` - Get messages
- `POST /messages/send` - Send message
- `POST /messages/conversations` - Create conversation
- `PUT /messages/conversations/:id/read` - Mark as read

### Lawyers

- `GET /lawyers` - List lawyers
- `GET /lawyers/:id` - Get lawyer details
- `GET /lawyers/:id/reviews` - Get lawyer reviews
- `POST /lawyers/reviews` - Submit review
- `POST /lawyers/consultations` - Request consultation

## Support

For API integration support:

- Check mock implementations for expected data formats
- Review error handling in HTTP client
- Use built-in logging for debugging
- Refer to TypeScript interfaces for data structures

---

**Note**: This integration layer provides a complete foundation for connecting to any REST API backend while maintaining type safety and excellent developer experience.
