# 💼 LinkedIn Clone – Simple Social Media Website


---

## 🧾 Project Description

This project is a **LinkedIn Clone – Simple Social Media Website**, created as part of the **Full Stack Developer Internship Assignment**.  
It allows users to **sign up, log in, create posts, and view posts** from all registered users — similar to LinkedIn’s main feed.



---

## 🎯 Features

- Register and log in using secure authentication  
- Create and view posts from all users in a common feed
- -Posts has timestamp and username of author
- User can create posts with description and also upload photos
- User can view his profile details and also posts in profile section
- Allow users to **log out** anytime
- User can like/Unlike and also can comment on the posts

Bonus features include **likes, comments, post editing, and image uploads**.

---

## ⚙️ How to Run the Project

### 1️. Clone the Repository

git clone https://github.com/mythrimutyapu7/socialmedia.git
cd socialmedia

### 2.Backend Setup
cd Backend
npm install mongoose dotenv cors jwt

.env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


### 3.Frontend Setup
cd Frontend
npm install

### 4.Start
Backend - node server.js
Frontend - npm run dev


TECH STACK:
| Layer              | Technology                          |
| :----------------- | :---------------------------------- |
| **Frontend**       | React.js, HTML, CSS, JavaScript     |
| **Backend**        | Node.js, Express.js                 |
| **Database**       | MongoDB (via Mongoose)              |
| **Authentication** | JWT (JSON Web Token)                |


