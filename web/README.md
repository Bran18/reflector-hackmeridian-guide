# Reflector × HackMeridian — web guide

Landing page and rendered guide for [`../reflector.md`](../reflector.md). Visual language follows [reflector.network](https://reflector.network/) (night teal, cyan, Oswald + Montserrat). HackMeridian shows up as a Lisbon event chip, not as a clone of the event site.

## Develop

```bash
cd hackguide/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The guide lives at `/guide`.

`npm run sync:content` copies `../reflector.md` into `content/` (runs automatically before `dev` and `build`).

## Deploy on Vercel

1. Import the repo (or only this folder as the **Root Directory**: `hackguide/web`).
2. Framework preset: **Next.js** (default build command `next build`).
3. Deploy.

No environment variables are required for the static guide. Optional: set a custom domain in the Vercel project settings.

## Structure

| Path | Role |
| --- | --- |
| `app/page.tsx` | Reflector-branded landing (HackMeridian as the venue) |
| `app/guide/page.tsx` | Full markdown guide |
| `content/reflector.md` | Generated copy of parent guide (do not edit by hand) |
