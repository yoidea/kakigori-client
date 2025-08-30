# かき氷注文システムクライアント (Kakigori Order System Client)

かき氷注文システムのサンプルです。

`http://localhost:5173/order/<storeId>`
<img width="1125" height="2436" alt="Screen Shot 2025-08-31 at 00 19 07" src="https://github.com/user-attachments/assets/ead87b81-a895-4ba2-bbfc-d1673442ea96" />
<img width="1125" height="2436" alt="Screen Shot 2025-08-31 at 00 19 12" src="https://github.com/user-attachments/assets/b97efb2d-c492-4171-b57a-421a54b955db" />

`http://localhost:5173/order/<storeId>/receipt/<orderId>`
<img width="1125" height="2436" alt="Screen Shot 2025-08-31 at 00 19 16" src="https://github.com/user-attachments/assets/716e7047-3e7b-4ded-bead-c3f4ac4e6339" />



---

## Index

- [Getting Started](#Getting-Started)
	- [Installation](#Installation)
	- [Set Environment Variable](#Set-Environment-Variable)
	- [Development](#Development)
- [Building for Production](#Building-for-Production)
- [Deployment](#Deployment)
	- [Docker Deployment](#Docker-Deployment)
	- [DIY Deployment](#DIY-Deployment)
- [Styling](#Styling)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Set Environment Variable

```bash
touch .env.local && echo "VITE_API_BASE=http://localhost:8080" > .env
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173/order/<storeId>`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
