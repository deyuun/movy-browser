# Movy Browser

Movy Browser is my personal full stack app for browsing movies. I started it as a simple React practice project but kept building, it now has user authentication, personal wathclists, infinite scroll, and a trailer player. I built it to get hands-on experience with React, Node.js, REST APIs, and connecting a frontend to my own backend.

## Features
- Browse popular, top-rated, and upcoming movies and trending movies
- Watch trailers directly in the app via a YouTube embed modal
- Search movies by title
- View full movie details like overview, rating, and release date, tagline, and streaming providers
- Register and log in with JWT authentication
- Create, rename, and delete personal watchlists
- Add and remove movies from your watchlist
- Clean and responsive UI
- Component-based React structure

## Tech Stack
- JavaScript
- HTML & CSS
- React.js + Vite
- Tailwind CSS
- React Router v7
- The Movie Database API (TMDB API)


## Getting Started
1. Clone the repository:
   ```bash
   git clone git@github.com:dencioo/movy-browser.git
2. Install Dependencies
   ```bash
   npm install
3. Add your .env file with your TMDB API key:
   ```bash
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_MOVY_API=https://movyapi.up.railway.app/api
4. Add your `.env` file to the backend in the root:
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key_here
   PORT=5000
5. Start the development server:
   ```bash
   npm run dev

## Deployment
You can see the live app here: https://movybrowser.vercel.app/

