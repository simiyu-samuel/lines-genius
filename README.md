# 🚀 Lines Genius

**Lines Genius** is a cutting-edge AI-powered web application that generates creative, catchy, and high-impact lines for any purpose. From business taglines and social media bios to marketing slogans, ad lines, quotes, and captions - all powered by OpenAI's advanced language models with intelligent fallback systems.

Built with modern web technologies including React, TypeScript, TailwindCSS, and Framer Motion, it delivers a premium user experience with stunning animations and responsive design.

---

## ✨ Features

### 🔮 **AI-Powered Line Generation**
- **OpenAI Integration**: Leverages GPT-3.5-turbo for high-quality, contextual line generation
- **Smart Fallback**: Automatic fallback to mock AI when OpenAI is unavailable
- **Multiple Categories**: 
  - Business taglines
  - Social media bios (Instagram, TikTok, Twitter)
  - Instagram captions & quotes
  - Marketing slogans & ad lines
  - Inspirational quotes
- **Tone Customization**: 7 different tones (funny, corporate, bold, romantic, minimalist, inspirational, motivational)
- **Custom Prompts**: Pro users can add specific requirements and context

### 🎨 **Premium User Experience**
- **Stunning UI**: Neon-themed design with cyberpunk aesthetics
- **Dark/Light Mode**: Smooth theme transitions with system preference detection
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Real-time Status**: Live AI connection and generation status indicators

### 👤 **User Management**
- **Authentication System**: Secure sign-up/sign-in with local storage
- **Saved Lines**: Personal collection with search and filtering
- **Usage Tracking**: Daily generation limits with visual indicators
- **Subscription Plans**: Free, Pro, and Business tiers with different features

### 🌐 **Community & Learning**
- **Interactive Community**: Join membership tiers with real-time enrollment
- **Course Platform**: Enroll in programming and content creation courses
- **Live Events**: Register for workshops and masterclasses
- **API Documentation**: Comprehensive developer resources

### 💳 **Payment Integration**
- **Multiple Payment Methods**: PayPal and M-Pesa support
- **Subscription Management**: Flexible plan upgrades and downgrades
- **Secure Processing**: Enterprise-grade payment security

### 📧 **Communication**
- **Contact System**: EmailJS integration for inquiries
- **Newsletter**: Subscription management with confirmation emails
- **Support**: Multiple contact channels and FAQ system

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | TailwindCSS, Custom Themes, Responsive Design |
| **Animations** | Framer Motion, Custom Keyframes |
| **Icons** | Lucide React |
| **Routing** | React Router DOM |
| **AI Integration** | OpenAI API (GPT-3.5-turbo) |
| **Payments** | PayPal SDK, M-Pesa API |
| **Email** | EmailJS |
| **State Management** | React Context API |
| **Build Tool** | Vite |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (optional, has fallback)
- EmailJS account (for contact forms)

### 1. Clone the Repository
```bash
git clone https://github.com/simiyu-samuel/lines-genius.git
cd lines-genius
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# OpenAI Configuration (Optional - has fallback)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID=your_subscription_template_id
VITE_EMAILJS_USER_ID=your_user_id

# PayPal Configuration (Optional)
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# M-Pesa Configuration (Optional - for Kenya)
VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
VITE_MPESA_PASSKEY=your_mpesa_passkey

# API Configuration
VITE_API_BASE_URL=https://api.linesgenius.com
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔧 Configuration

### OpenAI Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`
3. The app will automatically detect and use OpenAI for enhanced generation
4. Without the key, the app uses intelligent mock AI as fallback

### EmailJS Setup
1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up email templates for contact and subscription
3. Add your service ID, template IDs, and user ID to `.env`

### Payment Setup (Optional)
- **PayPal**: Get client ID from PayPal Developer Dashboard
- **M-Pesa**: Configure for Kenya-based payments

---

## 📱 Features Overview

### 🎯 **Line Generation**
- **Smart Categories**: Each category has optimized prompts for better results
- **Tone Intelligence**: AI understands and applies different writing styles
- **Context Awareness**: Custom prompts provide specific requirements
- **Quality Control**: Filters and validates generated content
- **Usage Limits**: Subscription-based generation limits with visual tracking

### 💾 **Data Management**
- **Local Storage**: Secure client-side data persistence
- **Search & Filter**: Advanced filtering by category, tone, and date
- **Export Options**: Copy individual lines or bulk export (Pro feature)
- **Data Sync**: Seamless experience across devices

### 🎨 **Design System**
- **Color Palette**: Cyberpunk-inspired neon colors with dark/light variants
- **Typography**: Inter font family with multiple weights
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible UI components
- **Animations**: Purposeful micro-interactions and transitions

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation with responsive design
│   ├── Footer.tsx      # Footer with newsletter signup
│   ├── ThemeToggle.tsx # Dark/light mode switcher
│   ├── PaymentModal.tsx # Payment processing interface
│   └── UsageIndicator.tsx # Subscription usage display
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ThemeContext.tsx # Theme management
│   ├── SavedLinesContext.tsx # Saved lines management
│   └── SubscriptionContext.tsx # Subscription state
├── pages/              # Main application pages
│   ├── Landing.tsx     # Homepage with hero and features
│   ├── Generator.tsx   # AI line generation interface
│   ├── SavedLines.tsx  # Personal line collection
│   ├── Auth.tsx        # Sign in/up forms
│   ├── Pricing.tsx     # Subscription plans
│   ├── Community.tsx   # Community membership
│   ├── Courses.tsx     # Course enrollment
│   ├── About.tsx       # About page
│   ├── Contact.tsx     # Contact form
│   └── ApiDocs.tsx     # API documentation
├── services/           # External service integrations
│   ├── openaiService.ts # OpenAI API integration
│   └── paymentService.ts # Payment processing
├── utils/              # Utility functions
│   └── mockAI.ts       # Fallback AI system
├── types/              # TypeScript type definitions
│   ├── subscription.ts # Subscription types
│   └── payment.ts      # Payment types
└── data/               # Static data
    └── subscriptionPlans.ts # Plan configurations
```

---

## 🔐 Security Features

- **API Key Protection**: Environment variables for sensitive data
- **Input Validation**: Comprehensive form validation and sanitization
- **Rate Limiting**: Built-in usage limits and monitoring
- **Secure Payments**: PCI-compliant payment processing
- **Data Privacy**: Local storage with user consent
- **CORS Protection**: Proper cross-origin resource sharing setup

---

## 🌟 Advanced Features

### 🤖 **AI Integration**
- **Intelligent Prompting**: Category-specific prompts for optimal results
- **Error Handling**: Graceful fallback with user-friendly messages
- **Usage Monitoring**: Token usage tracking and optimization
- **Response Validation**: Content filtering and quality assurance

### 📊 **Analytics & Monitoring**
- **Usage Statistics**: Track generation patterns and popular categories
- **Performance Metrics**: Monitor API response times and success rates
- **User Engagement**: Track feature usage and user journeys
- **Error Tracking**: Comprehensive error logging and reporting

### 🎯 **Subscription System**
- **Flexible Plans**: Free, Pro, and Business tiers
- **Feature Gating**: Progressive feature unlocking
- **Usage Tracking**: Real-time limit monitoring
- **Upgrade Prompts**: Smart upgrade suggestions

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

---

## 👥 Team

- **Samuel Simiyu** - Founder & Lead Developer
- **Wambia O. Kennedy** - Frontend Developer & Content Creator

---

## 🔗 Links

- **Live Demo**: [https://lines-genius.vercel.app](https://lines-genius.vercel.app)
- **GitHub**: [https://github.com/simiyu-samuel/lines-genius](https://github.com/simiyu-samuel/lines-genius)
- **YouTube**: [https://www.youtube.com/@LinesGenius](https://www.youtube.com/@LinesGenius)
- **Contact**: hello@linesgenius.com

---

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5-turbo API
- The React and TypeScript communities
- TailwindCSS for the utility-first CSS framework
- Framer Motion for smooth animations
- All contributors and beta testers

---

**Made with ❤️ for developers and creators worldwide**

🎥💻 Code • Create • Laugh