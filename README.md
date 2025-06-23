# Knowledge Packs Web Interface

This is the frontend for the Knowledge Packs Assistant application. It provides a user interface for interacting with the assistant and managing knowledge packs.

## Prerequisites

- Docker
- Docker Compose

## Setup

1.  **Create an environment file:**

    Create a `.env` file in the root of this directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  **Configure the API URL:**

    Open the `.env` file and set the `VITE_API_URL` to the address of your backend API. If you are running the backend locally with the default Traefik setup, the URL will be `http://kp-rag-api.localhost:8888`.

    ```
    VITE_API_URL=https://wbg-kp-api.quanti.ca
    ```

## Running the Service

To build and run the application, use Docker Compose:

```bash
docker-compose up -d --build
```

The web interface will be available through the Traefik proxy, which should be running separately. The service is configured to be accessible at `kp-web.localhost` by default.

The application will be served by NGINX and will be available at `http://wbgkp.quanti.ca`.

The React application expects the API to be available at the URL defined in the `VITE_API_URL` environment variable.

## Stopping the Service

To stop the service, run:

```bash
docker-compose down
```
