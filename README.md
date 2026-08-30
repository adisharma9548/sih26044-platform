# SIH26044 — Portal for Academia–Industry Collaboration

This is a full‑stack platform built for Smart India Hackathon 2024.

## Part 09: Resume and file management

Student documents are uploaded to a private Cloudinary folder; MongoDB stores only the file metadata. The API accepts PDF, DOC, and DOCX files up to 5 MB.

1. Create a free [Cloudinary account](https://cloudinary.com/users/register_free).
2. In `server/.env`, add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from the Cloudinary dashboard.
3. Start the API from `server` with `npm run dev`, and the frontend from `client` with `npm run dev`.

Cloudinary credentials must stay in `server/.env`; never add them to a Vite environment file or commit them to Git.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS (to be added)
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (to be added)

## Setup

### Frontend

```bash
cd client
npm install
npm run dev
