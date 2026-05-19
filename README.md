# arcana-vault-2026

## About

Front-end Progressive Web App (PWA) for the Arcana Vault project. A secure cloud-storage application for managing user videos, images, and documents.

## Project specification

- Ionic 8
- Angular 20
- Supabase
- Capacitor (native mobile support)
- PWA with service worker

## System requirement

- Node.js (v24 or later recommended)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)
- Ionic CLI (`npm install -g @ionic/cli`)

## Project setup for development

### Install dependencies

```shell
npm ci
```

### Set up environment variables

- Copy the example environment file:

```shell
cp src/environments/environment.ts src/environments/environment.development.ts
```

- Edit `src/environments/environment.development.ts` and fill in your configuration values

### Running the Development Server

```shell
npm start
```

- The app will be available at: `http://localhost:4200`
- The development server includes hot-reload for instant updates
- Check the console output for any startup errors or warnings

## Available scripts

| Script                | Description                  |
|-----------------------|------------------------------|
| `npm start`           | Start development server     |
| `npm run build`       | Build for development        |
| `npm run build:prod`  | Build for production         |
| `npm run watch`       | Build with watch mode        |
| `npm test`            | Run unit tests               |
| `npm run lint`        | Run linting                  |
| `npm run deploy:prod` | Deploy to Cloudflare Workers |

## Code quality

### Linting

```shell
npm run lint
```

Fix any lint issues before committing changes.

### Testing

```shell
npm test
```

## Building for production

```shell
npm run build:prod
```

The production build will be output to the `www/` directory with optimized assets and hashing.

## PWA Features

This application is configured as a Progressive Web App with:

- Service worker for offline support
- Web app manifest for installability
- Caching strategies defined in `ngsw-config.json`
- Responsive design for mobile and desktop

## Native mobile apps (Capacitor)

This project includes Capacitor for building native iOS and Android apps in the future.

### Initialize Capacitor (first time)

```shell
npx cap init
```

### Add platforms

```shell
npx cap add ios
npx cap add android
```

### Build and sync

```shell
npm run build:prod
npx cap sync
```

### Open in a native IDE

```shell
npx cap open ios
npx cap open android
```

## Deploying to Cloudflare Workers

This project is configured to deploy to Cloudflare Workers using Wrangler.

### Prerequisites

- Install Wrangler CLI: `npm install -g wrangler`
- Have a Cloudflare account and be logged in: `wrangler login`

### Build and deploy

```shell
npm run release:prod
```

## Project structure

```
src/
├── app/
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication feature
│   │   ├── item/          # Item management feature
│   │   └── master/        # Shared code across features
│   └── ports/             # External service integrations
│       └── backend/       # Backend API integration
├── environments/          # Environment configurations
├── theme/                 # Ionic theme variables
├── assets/                # Static assets
└── pwa/                   # PWA assets
```
