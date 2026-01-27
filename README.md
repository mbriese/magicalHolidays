# ✨ Magical Holidays

Your enchanted travel planner for theme park vacations. Plan, organize, and track all your reservations in one magical place.

## Features

- 📅 **Interactive Calendar** - View your trip in month, week, or day format
- 🎢 **Multiple Reservation Types** - Track parks, rides, hotels, car rentals, and flights
- 👨‍👩‍👧‍👦 **Group Trips** - Invite family and friends to collaborate on trip planning
- 📝 **Blog/News** - Stay updated with park changes and holiday events
- 🔐 **Secure Accounts** - Email/password authentication

## Tech Stack

- **Framework:** Next.js 16.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Calendar:** FullCalendar

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd magicalHolidays
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Start PostgreSQL with Docker**
   ```bash
   npm run docker:up
   ```

5. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Setup (All-in-One)

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run docker:up` | Start PostgreSQL container |
| `npm run docker:down` | Stop PostgreSQL container |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run setup` | Full setup (Docker + Prisma) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── blog/              # Blog/news pages
│   ├── dashboard/         # Main dashboard
│   ├── trips/             # Trip management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── calendar/          # Calendar components
├── lib/                   # Utility functions
│   └── prisma.ts          # Prisma client
└── types/                 # TypeScript types
    └── index.ts
```

## Database Schema

### Core Models

- **User** - User accounts with authentication
- **Trip** - Trip containers with destination and dates
- **TripMember** - Many-to-many relationship for trip collaboration
- **Reservation** - Individual reservations (parks, rides, hotels, etc.)
- **BlogPost** - News and updates
- **DisneyNugget** - Fun facts and quotes (future feature)

## Reservation Types

| Type | Color | Description |
|------|-------|-------------|
| Park | Purple | Theme park entry reservations |
| Ride | Blue | Ride/attraction times |
| Hotel | Gold | Accommodation |
| Car | Green | Car rentals |
| Flight | Sky Blue | Air travel |

## Theming

Magical Holidays uses an enchanting color palette inspired by fantasy and wonder:

- **Primary:** Purple (#8b5cf6)
- **Accent:** Gold (#f59e0b)
- **Background:** Soft purple gradients
- **Dark mode:** Midnight blue tones

> **Note:** This is an independent travel planning tool. We are not affiliated with, endorsed by, or connected to any theme park or entertainment company.

## Future Enhancements

- [ ] Real booking API integrations
- [ ] Email notifications for trip updates
- [ ] Affiliate links for merchandise
- [ ] Disney Nuggets - personalized quotes and facts
- [ ] Social login options
- [ ] Mobile app

## License

ISC

---

Made with ✨ magic
