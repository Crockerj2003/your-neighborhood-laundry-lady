## Your neighborhood laundry lady

Website for a pickup and delivery laundry service with online booking and an admin portal.

### Features

- Customer booking form with:
  - Name
  - Address
  - Pickup time
  - Phone number
  - Email
  - Additional notes (allergies, preferences, etc.)
- Admin login portal to view bookings
- Prisma + PostgreSQL storage (Vercel friendly)
- Branded landing page with slogan: `clean clothes, less stress`

### Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables and fill in your values:

   ```bash
   copy .env.example .env
   ```

3. Push schema to your database:

   ```bash
   npm run db:push
   ```

4. Start dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_PASSWORD`: Password for `/admin/login`

### Deploying to Vercel

1. Create a Postgres database in Vercel Storage (or any external PostgreSQL provider).
2. Add `DATABASE_URL` and `ADMIN_PASSWORD` to Vercel project environment variables.
3. Deploy with Vercel.
4. Run `npm run db:push` against your production database before taking bookings.
