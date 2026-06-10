# FaceCheck System

An Face Recognition System built using React, Flask, DeepFace, OpenCV, and TensorFlow for real-time face registration, recognition, and verification.

## Features

* Real-time webcam image capture
* Face registration with user names
* Face recognition using DeepFace
* Duplicate face detection
* Invalid image detection (rejects non-face images)
* Registered faces management
* Delete registered faces
* Modern responsive user interface
* Flask REST API backend
* React frontend with live image preview

---

## Project Structure

```
FaceCheck System/
│
├── backend/
│   ├── app.py                 # Flask backend server
│   └── uploads/               # Registered face images
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # UI styling
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   │
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
│
├── .gitignore
├── requirements.txt           # Python dependencies
└── README.md
```

---

## Technologies Used

### Frontend

* React.js
* Vite
* HTML
* CSS
* Axios
* React Webcam

### Backend

* Python
* Flask
* Flask-CORS
* DeepFace
* OpenCV
* TensorFlow
* NumPy

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/FaceCheck-AI.git
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

## Usage

### Register a Face

1. Open the application.
2. Allow webcam access.
3. Capture or upload an image.
4. Enter the person's name.
5. Click **Register Face**.

The system validates:

* Human face presence
* Duplicate registrations
* Invalid images

---

### Recognize a Face

1. Capture or upload an image.
2. Click **Recognize Face**.
3. The system compares the face with registered faces.
4. Displays:

   * Name
   * Recognition confidence
   * Recognition status

---

### Delete a Face

1. Navigate to **Registered Faces**.
2. Click the **Delete** button next to the person's name.
3. The face will be permanently removed.

---

## API Endpoints

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/register_face`        | Register a new face       |
| POST   | `/recognize_face`       | Recognize a face          |
| GET    | `/get_registered_faces` | Retrieve registered faces |
| DELETE | `/delete_face/<name>`   | Delete a registered face  |

---

## Face Recognition Workflow

### Face Registration

* Capture image from webcam or upload image
* Validate that a human face exists
* Detect duplicate registrations
* Store validated face image

### Face Recognition

* Capture or upload image
* Compare against registered faces using DeepFace
* Identify matching face
* Return recognized name and confidence score

---

## Constraints

* Requires a clear frontal face image
* Adequate lighting improves recognition accuracy
* Multiple faces in a single image are not supported
* Facial obstructions (masks, sunglasses, etc.) may reduce accuracy
* Extreme face angles can affect recognition performance
* Webcam permission is required for real-time capture

---

## Future Enhancements

* User Authentication & Login
* Database Integration (MongoDB/MySQL)
* Cloud Deployment
* Multi-Face Recognition
* Liveness Detection
* Face Recognition-Based Access Control

---

## Author
**Sahithi Kondeti**

---

## License

This project is developed for educational and demonstration purposes.
