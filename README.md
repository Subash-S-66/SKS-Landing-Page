# SKS Services — Complete Portfolio & Admin Platform

A premium digital agency site crossed with a personal brand. Built with Next.js 14, Tailwind CSS, Three.js, Express, and MongoDB.

## Features
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber (3D Background).
- **Backend**: Express.js REST API, MongoDB, JWT Authentication, bcrypt, Cloudinary, Nodemailer.
- **Admin Dashboard**: Hidden login (bottom-left corner or 3-tap copyright), full CRUD for Services, Portfolio, Testimonials, Enquiries, and Settings.
- **Security**: Next.js API proxying (Express backend hidden from public), X-Internal-Token guard, Rate limiting, Helmet.js.

## Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary Account (for image uploads)
- Gmail App Password (for Nodemailer)

## Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_here
INTERNAL_API_TOKEN=your_internal_proxy_token_here_for_nextjs
MONGODB_URI=mongodb://localhost:27017/sks-services

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=your_email@gmail.com
```

Create a `.env.local` file in the `frontend/` directory:
```env
BACKEND_URL=http://localhost:5000/api
INTERNAL_API_TOKEN=your_internal_proxy_token_here_for_nextjs
```

## Local Development Setup

1. **Backend**:
   `cd backend`
   `npm install`
   `npm run seed` (Seeds the DB with default admin and content)
   To run: `npm start` or `npm run dev`

2. **Frontend**:
   `cd frontend`
   `npm install`
   To run: `npm run dev`

## Admin Access
- **Default Credentials**: `admin` / `Admin@SKS2024`
- **Access Method 1**: Click the invisible 40x40px square in the absolute bottom-left corner of the site.
- **Access Method 2**: Click the footer copyright text 3 times within 1.5 seconds.

## Deployment

### Docker (Recommended)
`docker-compose up -d --build`

### Vercel (Frontend)
1. Import the `frontend` folder into Vercel.
2. Add `BACKEND_URL` and `INTERNAL_API_TOKEN` to Vercel environment variables.
3. Deploy.

### PM2 (Backend)
`cd backend`
`npm install`
`npm install -g pm2`
`pm2 start src/server.js --name sks-backend`
