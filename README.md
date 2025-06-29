# YRJR Legal Assistant

A comprehensive React Native application designed specifically for the Indian legal system, providing tools for legal professionals, students, and support staff.

## 🚀 Latest Updates (v1.2.0)

### ✅ **Phone-Based Authentication**

- **Primary Login**: Users now sign in with phone numbers (+91 default) instead of email
- **Indian Mobile Support**: Validates 10-digit Indian mobile numbers with proper prefixes (6,7,8,9)
- **Formatted Display**: Phone numbers display as +91-XXXXX-XXXXX format
- **Demo Accounts**: Updated to use consistent phone number for all demo roles

### ✅ **Enhanced Forgot Password**

- **Multi-Method Reset**: Choose between SMS (recommended) or Email OTP
- **6-Digit OTP System**: Secure verification with 5-minute expiry
- **Resend Functionality**: Resend OTP with 60-second cooldown
- **Progress Tracking**: Step-by-step password reset flow
- **Error Handling**: Comprehensive validation and error messages

### ✅ **Fixed Profile Navigation**

- **Settings**: Direct navigation to comprehensive settings screen (/settings)
- **Help & Support**: Complete FAQ, contact options, and feedback system (/help-support)
- **Privacy Policy**: Detailed legal privacy policy (/privacy-policy)
- **Terms & Conditions**: Comprehensive terms of service (/terms-of-service)
- **All Links Working**: No more "Coming Soon" alerts

### ✅ **Enhanced Localization**

- **25+ Indian Languages**: Complete support for all major Indian languages
- **Regional Languages**: Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, and more
- **Script Support**: Proper rendering for Devanagari, Bengali, Telugu, Tamil, Gujarati, and Arabic scripts
- **RTL Support**: Right-to-left text support for Urdu and Sindhi

### ✅ **Theme Customization**

- **Post-Login Theme Setup**: New theme selection screen after first login
- **Live Preview**: Real-time theme preview before selection
- **System Integration**: Automatic theme switching based on device settings
- **Persistent Preferences**: Theme choice saved and applied across app sessions

### ✅ **Improved User Experience**

- **Phone-First Signup**: Phone number as primary identifier, email optional
- **Better Validation**: Enhanced form validation with clear error messages
- **Smooth Onboarding**: Streamlined user registration and setup flow
- **Consistent Navigation**: Fixed all broken navigation links and alerts

## 📱 Features Overview

### **Core Authentication**

- Phone-based login with +91 country code
- OTP verification for password reset (SMS/Email)
- Role-based access control (5 user types)
- Biometric authentication support
- Multi-factor authentication options

### **Legal Tools**

- **Legal Pinboard**: Organize research and case notes
- **Case Timeline**: Track case progress and deadlines
- **Secure Notes**: Encrypted note storage with biometric lock
- **AI Section Comparator**: Compare legal sections and statutes
- **Document Scanner**: OCR scanning for legal documents
- **Templates Hub**: Access to legal document templates
- **Flashcards**: Legal learning and exam preparation

### **Professional Features**

- **Lawyer Verification**: Bar Council number verification
- **Professional Networking**: Connect with legal professionals
- **Subscription Management**: Free, Pro, and Premium tiers
- **Analytics Dashboard**: Case and performance tracking
- **Calendar Integration**: Court dates and appointment management

### **Admin Panel**

- User approval and verification management
- System analytics and health monitoring
- Subscription and payment management
- Content moderation and quality control

## 🎯 User Roles

1. **Law Student** - Basic features for learning and study
2. **Law Office Helper** - Administrative support tools
3. **Lawyer Assistant** - Case management and documentation
4. **Junior Lawyer** - Full professional tools (approval required)
5. **Senior Lawyer** - Complete access with premium features
6. **Administrator** - System management and oversight

## 🌍 Supported Languages

### **Major Indian Languages**

- **English** (Primary)
- **Hindi** (हि���दी) - Complete translation
- **Bengali** (বাংলা) - Native script support
- **Telugu** (తెలుగు) - Andhra Pradesh/Telangana
- **Tamil** (தமிழ்) - Tamil Nadu
- **Marathi** (मराठी) - Maharashtra
- **Gujarati** (ગુજરાતી) - Gujarat
- **Kannada** (ಕನ್ನಡ) - Karnataka
- **Malayalam** (മലയാളം) - Kerala
- **Odia** (ଓଡ଼ିଆ) - Odisha
- **Punjabi** (ਪੰਜਾਬੀ) - Punjab
- **Assamese** (অসমীয়া) - Assam
- **Urdu** (اردو) - RTL support

### **Regional & Constitutional Languages**

- Nepali, Sinhala, Sindhi, Kashmiri, Sanskrit
- Bhojpuri, Maithili, Konkani, Manipuri, Santali, Dogri

## 🔧 Technical Stack

- **Framework**: React Native 0.79.4 with Expo
- **Navigation**: Expo Router v5.1.0
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data
- **Authentication**: Custom JWT-based system
- **Biometrics**: Expo Local Authentication
- **Internationalization**: react-i18next
- **Styling**: StyleSheet with theme system
- **TypeScript**: Full type safety

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-org/yrjr-legal-assistant.git

# Navigate to project directory
cd yrjr-legal-assistant

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## 🚀 Getting Started

### **Demo Accounts**

All demo accounts use:

- **Phone**: +91-98765-43210
- **Password**: demo123

**Available Roles**:

- Law Student
- Office Helper
- Legal Assistant
- Junior Lawyer
- Senior Lawyer
- Administrator (admin123)

### **First Time Setup**

1. Choose your role during signup
2. Verify your phone number with OTP
3. Complete professional profile (lawyers)
4. Select your preferred theme
5. Choose your language preference
6. Start using the app!

## 🛡️ Security Features

- **End-to-end encryption** for sensitive data
- **Biometric authentication** (fingerprint/face ID)
- **Multi-factor authentication** support
- **Secure token management** with auto-refresh
- **Data minimization** and retention policies
- **Regular security audits** and updates

## 📄 Legal Compliance

- **Digital Personal Data Protection Act, 2023** compliant
- **Information Technology Act, 2000** adherence
- **Bar Council of India** regulations compliance
- **Client confidentiality** protection
- **Professional ethics** enforcement

## 🔮 Upcoming Features

- **Video Consultations**: Remote legal consultations
- **Real-time Collaboration**: Multi-user document editing
- **Advanced Analytics**: AI-powered insights
- **Court Integration**: Direct court filing systems
- **Voice Commands**: Enhanced accessibility
- **Offline Mode**: Core features without internet

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 Support

- **Email**: support@yrjr.app
- **Phone**: +91-XXXX-XXXXXX
- **Help Center**: [help.yrjr.app](https://help.yrjr.app)
- **Emergency Legal Help**: National Helpline 1860

## 📄 License

Copyright © 2024 YRJR Legal Tech. All rights reserved.

This application is proprietary software designed for legal professionals in India. Unauthorized distribution or modification is prohibited.

---

**Made with ❤️ for the Indian Legal Community**

_Empowering legal professionals with modern technology while maintaining the highest standards of security, ethics, and professional responsibility._
