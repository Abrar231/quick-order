# Single Page Ordering App With Chat Interface for MongoDB Querying

This project is a ordering app with chat-based interface that allows users to query a **MongoDB database**. It integrates **Express.js**, **Socket.io** and **Next.js**.

## 🚀 Features
- **Real-time chat with WebSockets (Socket.io)**
- **MongoDB integration** for fetching product data
- **React frontend** for a chat interface
- **REST API support** for additional functionality

---

## 📌 Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or using MongoDB Atlas)
- [Git](https://git-scm.com/)

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Abrar231/quick-order.git
cd quick-order
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_SERVER_URL= your_express_server_url
PORT=3000
NEXT_PUBLIC_SOCKET_URL= your_socket_url
```

### 4️⃣ Start the Backend Server and Frontend
```sh
npm run dev
```

```

The application will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints
| Method | Endpoint     | Description                 |
|--------|-------------|-----------------------------|
| POST   | `/chat`     | Process a user query       |
| GET    | `/products` | Fetch all products         |

---

## 💬 WebSocket Events
| Event       | Description                        |
|------------|----------------------------------|
| `userQuery` | Sent by client with a user query |
| `botResponse` | Response from the AI server |

---

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js, MongoDB,
- **Frontend:** Next.js, React.js, Socket.io-client, Tailwind CSS

---

## 🤝 Contributing
Feel free to submit pull requests or report issues!

---

## 📜 License
This project is licensed under the **MIT License**.

---

### 🌟 Star the repo if you find it useful!

