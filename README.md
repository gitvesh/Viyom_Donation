# Viyom Donation Platform

A modern, transparent donation management platform built with React and Spring Boot.

## 🌟 Features

### For Donors
- 💳 Secure online donations via Razorpay
- 📊 Real-time donation tracking
- 📱 Mobile-responsive design
- 🔒 Anonymous donation option
- 📄 Downloadable donation receipts (PDF)
- 🎯 Sector-specific donations

### For Administrators
- 📈 Comprehensive dashboard
- 👥 Donor management
- 💰 Fund allocation tracking
- 📊 Detailed reports and analytics
- 🏦 Pool management
- 👨‍👩‍👧‍👦 Beneficiary management
- ⛓️ Blockchain ledger integration
## 🛠️ Tech Stack
### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- jsPDF (receipt generation)
- Razorpay Integration

### Backend
- Spring Boot 3.x
- Spring Security + JWT
- MySQL Database
- Hibernate/JPA
- Razorpay Payment Gateway
- Maven

## 📋 Prerequisites

- Node.js 16+ and npm
- Java 17+
- MySQL 8+
- Git

## 🚀 Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/viyom-donation-platform.git
cd viyom-donation-platform
```

### 2. Setup Backend
```bash
cd backend

# Configure database in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/viyom_donation
spring.datasource.username=root
spring.datasource.password=your_password

# Run backend
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Create .env file with:
REACT_APP_API_URL=http://localhost:8080/viyom/api
REACT_APP_RAZORPAY_KEY=rzp_test_YOUR_KEY

# Run frontend
npm start
```

Frontend runs on: `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel (Frontend)
See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

### Deploy to Render (Backend)
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Steps:**
1. Create Render account
2. Create Web Service
3. Connect GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

## 📚 Documentation

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Frontend deployment guide
- [VERCEL_QUICK_START.md](VERCEL_QUICK_START.md) - Quick deployment steps
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project structure overview

## 🔑 Default Credentials

### Admin Account
- Email: `admin@viyom.com`
- Password: `admin123`

### Test User
- Email: `user@test.com`
- Password: `user123`

**⚠️ Change these credentials in production!**

## 🔐 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080/viyom/api
REACT_APP_RAZORPAY_KEY=rzp_test_YOUR_KEY
```

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/viyom_donation
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=your-secret-key
razorpay.key.id=rzp_test_YOUR_KEY
razorpay.key.secret=YOUR_SECRET
```

## 📱 Features Overview

### User Features
- ✅ User registration and login
- ✅ Browse donation sectors
- ✅ Make donations to specific pools
- ✅ Track donation history
- ✅ Download donation receipts
- ✅ View donation impact
- ✅ Anonymous donations

### Admin Features
- ✅ Dashboard with statistics
- ✅ Manage sectors and pools
- ✅ View all donations
- ✅ Manage beneficiaries
- ✅ Allocate funds
- ✅ View allocation history
- ✅ Generate reports
- ✅ Download receipts (individual/bulk)
- ✅ Blockchain ledger tracking

## 🏗️ Project Structure

```
viyom-donation-platform/
├── backend/              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java source code
│   │   │   └── resources/ # Configuration files
│   │   └── test/        # Unit tests
│   └── pom.xml          # Maven dependencies
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── services/    # API services
│   └── package.json     # NPM dependencies
│
└── README.md           # This file
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed by the Viyom Team

## 📞 Support

For support, email support@viyom.org or open an issue on GitHub.

## 🙏 Acknowledgments

- Razorpay for payment gateway
- Tailwind CSS for styling
- React community for amazing tools
- Spring Boot community

---

**Made with ❤️ for transparent donations**
