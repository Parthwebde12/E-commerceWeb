# Scatch

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Set `MONGO_URI` to a reachable MongoDB database and replace `JWT_KEY` with a
   random secret of at least 32 characters.
3. Run `npm ci`, then `npm start` (or `npm run dev` while developing).

The app uses a local MongoDB database at `mongodb://127.0.0.1:27017/scatch` if
`MONGO_URI` is omitted outside production.

## Deploy to Render

Create a Render Blueprint from this repository using `render.yaml`. Configure
the prompted `MONGO_URI` with your MongoDB connection string and `JWT_KEY` with
a unique random secret of at least 32 characters. The service uses Node.js 22,
installs from the lockfile, waits for MongoDB before listening, and exposes
`/health` as its readiness check.

Product images are currently written to the app's local filesystem. Render's
default filesystem is ephemeral, so uploaded images can disappear after a
restart or deploy. Use a persistent disk or external object storage before
relying on product uploads in production.