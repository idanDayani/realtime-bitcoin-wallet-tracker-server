# Real-time Bitcoin Wallet Tracker

This project is a real-time Bitcoin wallet tracker. It fetches wallet data from the BlockCypher API, processes it through a Kafka pipeline, and pushes real-time updates to connected web clients using WebSockets.

## Tech Stack

-   Node.js
-   TypeScript
-   Docker
-   Kafka
-   WebSockets

## Data Flow

```mermaid
graph TD
    subgraph "Data Sources"
        A[BlockCypher API]
        P[BTC/USD Price API]
    end

    B(Node.js Backend)

    A -- "Fetch wallet balances (batch)" --> B
    P -- "Fetch BTC/USD price" --> B

    B -- "Produce batch of messages" --> K[Kafka Broker]

    subgraph "Kafka Consumers (in Backend)"
        K -->|wallet-updates topic| WC(WalletTrackerConsumer)
        K -->|log-events topic| LC(LogConsumer)
    end

    WC -- "Broadcast event (one by one)" --> WS(WebSocket Server)
    LC -- "Write log entries (in batches)" --> LF(events.log)

    subgraph "Web Clients"
        WS -- "Push real-time updates" --> C1(Web Client 1)
        WS -- "Push real-time updates" --> C2(Web Client 2)
        WS -- "Push real-time updates" --> CN(Web Client N)
    end
```

## Getting Started

Follow these instructions to get the project set up and running on your local machine.

### Requirements

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [Docker](https://www.docker.com/products/docker-desktop)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1.  Clone the repository and navigate to the server directory.

2.  Install NPM packages:

    ```sh
    npm install
    ```

3.  Start the Kafka broker and other services using Docker Compose. This will start Kafka and Zookeeper.

    ```sh
    docker-compose up --build
    ```

4.  In a new terminal, run the application:

    ```sh
    npx ts-node src/index.ts
    ```

5.  Optionally set environment variables in .env:
    ```sh
    BLOCKCYPHER_TOKEN (https://accounts.blockcypher.com/tokens)
    ```

## Demonstration

Here is a demonstration of the project in action(You must have the [realtime-bitcoin-wallet-tracker-client](https://github.com/idanDayani/realtime-bitcoin-wallet-tracker-client) repo for it):

![Bitcoin Wallet Tracker Demo](https://github.com/idanDayani/realtime-bitcoin-wallet-tracker-server/blob/main/%20demo.gif)
