# Madrasa Management System - Sufia Nuria Dakhil Madrasa

A modern, full-featured management system for Madrasas built with React, Vite, CSS3, and Supabase.

## ✨ Features
- **Public Website**: Home, About, Contact, and Digital Notice Board.
- **Role-Based Dashboards**: 
  - **Admin**: Approve new users, publish notices, and manage the system.
  - **Teacher**: Mark attendance, enter results, and manage students.
  - **Student**: View personalized results, attendance, and latest school notices.
- **Security**: 
  - Secure Authentication via Supabase.
  - 5-attempt login lockout system.
  - Row-Level Security (RLS) policies for data protection.
- **Premium Design**:
  - Logo-based smooth preloader.
  - Responsive glassmorphism UI.
  - Framer Motion animations.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- A Supabase Account

### 2. Supabase Configuration
1. Create a new project on [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `database_schema.sql` (found in this folder).
3. Under **Project Settings > API**, copy your `URL` and `anon public` key.

### 3. Frontend Setup
1. Clone this repository or open the folder in your terminal.
2. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `src/pages`: Individual page components.
- `src/components`: Reusable UI elements (Navbar, Preloader).
- `src/lib`: Supabase client configuration.
- `src/index.css`: Global design system and styles.
- `database_schema.sql`: Database tables and security policies.

## 🔒 Security Features
- **Passwords**: Hashed automatically by Supabase Auth.
- **SQL Injection**: Prevented via Supabase's PostgREST API.
- **Lockout**: Implemented in `Login.jsx` to prevent brute-force attacks.
- **Authorization**: Role-based access handled via React Context and Supabase RLS.
