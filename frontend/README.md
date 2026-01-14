# Viyom - Transparent NGO Donations Platform

A React-based web application for transparent and secure NGO donations powered by blockchain technology.

## Features

- **Public Pages**: Home, Sectors, Education Sector, Donation Form, Payment Processing, Success Page
- **User Dashboard**: Personal dashboard, donation tracking, donation history
- **Admin Dashboard**: Complete admin panel for managing sectors, donations, beneficiaries, allocations, and blockchain ledger
- **Authentication**: Dummy authentication system (ready for backend integration)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Login as Regular User
- Navigate to `/login`
- Enter any email and password
- Leave "Login as Admin" unchecked
- Click Login

### Login as Admin
- Navigate to `/login`
- Enter any email and password
- Check "Login as Admin"
- Click Login

## Project Structure

```
src/
├── components/          # Reusable components (Header, Footer, etc.)
│   ├── admin/          # Admin-specific components
│   └── ...
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── user/           # User pages
│   └── ...             # Public pages
├── context/            # React context (AuthContext)
└── App.js              # Main app component with routing
```

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- CSS3 (Custom styling to match designs)

## Notes

- Authentication is currently dummy-based (no backend)
- All data is static/mock data
- Ready for backend integration

