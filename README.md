# SkillBridge — SIH26044

SkillBridge is an Academia–Industry collaboration platform for skill mapping, career readiness, assessments, portfolios, and institutional insight.

## Current capabilities

- Role-based registration and JWT authentication for students, industry, faculty, and institutions
- Student profile, skills, projects, education, certifications, secure resume, and portfolio documents
- Career intelligence with readiness, skill gaps, and a target-role roadmap derived from saved student data
- Institution-created MCQ assessments with server-side scoring and single-attempt protection
- API-backed role workspaces and institution assessment metrics
- Responsive SkillBridge interface with a CSS-built brand mark

## Local setup

Copy `server/.env.example` to `server/.env` and configure MongoDB and JWT values. Keep all secrets out of Git.

For private file storage, add Cloudinary credentials to `server/.env.cloudinary.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The local Cloudinary file is ignored by Git. It is loaded after `server/.env`, so its credentials take precedence.

Start the API:

```cmd
cd server
npm install
npm run dev
```

Start the client in another terminal:

```cmd
cd client
npm install
npm run dev
```

## Verification

```cmd
cd server
npm run build
```

```cmd
cd client
npm run build
npm run lint
```

## Development status

Parts 1–10 provide project setup, authentication, profile/portfolio management, secure documents, skills, career intelligence, and assessments. The opportunity marketplace and application lifecycle remain the next major implementation areas.
