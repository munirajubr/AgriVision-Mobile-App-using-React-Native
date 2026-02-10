# AgriVision

> AgriVision — an integrated crop monitoring and diagnosis system with a Node.js backend and a React Native (Expo) mobile app.

## Features
- User authentication (signup / login)
- Device management (register, update, view devices)
- Image uploads and disease diagnosis workflows
- Notifications and settings via mobile app

## Repository structure

- `backend/` — Express API, controllers, models, and utilities
- `mobile/` — Expo React Native app (app directory, assets, components)

## Quick start

Prerequisites: Node.js (14+), npm or yarn, Git, and optionally Expo CLI.

Backend

1. Install dependencies and run the API:

```bash
cd backend
npm install
# create a .env with required variables (example below)
npm start
```

2. Recommended environment variables (create `backend/.env`):

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — signing secret for authentication
- `CLOUDINARY_URL` (or cloudinary keys) — if using Cloudinary for uploads
- `PORT` — optional server port (default 3000)

Mobile (Expo)

1. Install dependencies and start the development server:

```bash
cd mobile
npm install
npm start
```

2. The mobile app uses the `app/` directory (Expo + React Navigation). Follow Expo prompts to run on device or simulator.

## Environment & Configuration
- Backend: configure `backend/.env` with the values above.
- Mobile: update any API base URL constants in `mobile/constants/api.js` to point at your running backend.

## Contributors

- Muniraju B R: https://github.com/munirajubr
- Harshita Sakaray: https://github.com/harshita-sakaray26
- Gunashree H M: https://github.com/gunashree-hm
- Disha S Kashipati: https://github.com/Disha-S-Kashipati

## License
This project is provided under the MIT License.

---

If you want, I can also add a `.gitignore`, CI workflow, or a short CONTRIBUTING guide next.
