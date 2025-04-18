# Alumni Portal

## Overview

The Alumni Portal is a full-stack web application designed to connect students and alumni for mentorship, career guidance, industry exposure, and networking. The platform aims to bridge communication gaps and foster collaboration through intelligent matchmaking and real-time interaction.

It features AI-driven mentor matching using NLP techniques such as vectorization and cosine similarity, article auto-summarization via the Gemini API, and a secure, scalable architecture for direct messaging and alumni engagement.

---

## Problem Statement

Many institutions face challenges in facilitating meaningful connections between students and alumni. These include:

- Lack of structured mentorship opportunities.
- Difficulty accessing career guidance and job opportunities.
- Limited alumni engagement channels.
- Fragmented resources and insights for student development.

---

## Objectives

- Enable structured and intelligent mentor matching using AI and NLP.
- Offer real-time chat and seamless alumni-student interactions.
- Provide a centralized platform for articles, job posts, feedback, and discussions.
- Strengthen alumni engagement with their alma mater.

---

## Key Features

### AI-Based Mentor Matching

- Uses cosine similarity on field-wise vectorized data (skills, job title, department, bio).
- FastAPI backend performs sentence-transformer-based semantic matching.
- Personalized mentor suggestions for each student.

### Real-Time Messaging

- Secure, WebSocket-based chat for seamless student-alumni communication.

### Article Hub with AI Summarization

- Alumni can post articles, interview experiences, and tips.
- Articles are automatically summarized using the Gemini API for quick reading.

### Feedback Interface

- Collects anonymous user feedback for improving platform experience.

### Alumni Directory

- Allows students to search for and connect with alumni by expertise or industry.

### Authentication and Profiles

- Role-based login and signup (student, alumni, admin).
- JWT-secured authentication and profile management.

---

## Tech Stack

### Frontend

- **React** (with Vite) – Component-based UI
- **TypeScript** – Static typing
- **Tailwind CSS** – Utility-first styling
- **Redux Toolkit** – State management

### Backend

- **Node.js + Express** – REST APIs
- **MongoDB** – NoSQL database
- **JWT** – Authentication
- **Cloudinary** – Media storage (images, article thumbnails)

### AI/NLP Services

- **Python + FastAPI** – AI microservice for mentor matching
- **Sentence Transformers** – Semantic vector encoding
- **Cosine Similarity** – Match scoring
- **Gemini API** – AI-based summarization for articles

---

## Installation

### Prerequisites

- Node.js (v16 or later)
- Python (v3.8+)
- MongoDB Atlas or local instance
- npm or yarn
- Git

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alumni-portal.git
cd alumni-portal
```

### 2. Set Up the Frontend

```bash
cd Client
npm install
```

Start the frontend:

```bash
npm run dev
```

### 3. Set Up the Backend

```bash
cd ../Server
npm install
```

Create a `.env` file in the `Server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

Start the backend:

```bash
npm run dev
```

### 4. Set Up the AI Microservice

```bash
cd ../Services/MentorFinder
pip install -r requirements.txt
```

Create a `.env` file if required for the Gemini API:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI service:

```bash
uvicorn main:app --reload
```

---

Now all three services (frontend, backend, AI microservice) should be running locally.
