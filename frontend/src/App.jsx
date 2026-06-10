import React, { useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import './App.css'

function App() {
  const [webcamRef, setWebcamRef] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [registeredFaces, setRegisteredFaces] = useState([])
  const [recognitionResult, setRecognitionResult] = useState(null)

  const API_BASE = 'http://127.0.0.1:5000'

  useEffect(() => {
    loadRegisteredFaces()
  }, [])

  const loadRegisteredFaces = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get_registered_faces`
      )
      setRegisteredFaces(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const captureImage = () => {
    if (webcamRef) {
      const imageSrc = webcamRef.getScreenshot()
      setCapturedImage(imageSrc)
      setRecognitionResult(null)
      setMessage('')
    }
  }

  const clearImage = () => {
    setCapturedImage(null)
    setRecognitionResult(null)
    setMessage('')
    setRegisterName('')
  }

  const registerFace = async () => {
    if (!capturedImage || !registerName.trim()) {
      setMessage('Please capture an image and enter a name')
      setMessageType('error')
      return
    }

    setIsRegistering(true)

    try {
      const blob = await fetch(capturedImage)
        .then(res => res.blob())

      const formData = new FormData()

      formData.append(
        'image',
        blob,
        'capture.jpg'
      )

      formData.append(
        'name',
        registerName.trim()
      )

      const response = await axios.post(
        `${API_BASE}/register_face`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data'
          }
        }
      )

      setMessage(response.data.message)

      if (response.data.success) {
        setMessageType('success')
        setCapturedImage(null)
        setRegisterName('')
        loadRegisteredFaces()
      } else {
        setMessageType('error')
      }

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        'Error registering face'
      )

      setMessageType('error')

    } finally {
      setIsRegistering(false)
    }
  }

  const recognizeFace = async () => {

    if (!capturedImage) {
      setMessage('Please capture an image first')
      setMessageType('error')
      return
    }

    setIsRecognizing(true)

    try {

      const blob = await fetch(
        capturedImage
      ).then(res => res.blob())

      const formData = new FormData()

      formData.append(
        'image',
        blob,
        'capture.jpg'
      )

      const response = await axios.post(
        `${API_BASE}/recognize_face`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data'
          }
        }
      )

      if (
        response.data.success &&
        response.data.recognized
      ) {

        setRecognitionResult({
          name: response.data.name,
          confidence:
            response.data.confidence
        })

        setMessage(
          `Recognized: ${response.data.name}`
        )

        setMessageType('success')

      } else {

        setRecognitionResult(null)

        setMessage(
          response.data.message
        )

        setMessageType('error')
      }

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        'Error recognizing face'
      )

      setMessageType('error')

    } finally {
      setIsRecognizing(false)
    }
  }

  const deleteFace = async (name) => {
    try {

      const response =
        await axios.delete(
          `${API_BASE}/delete_face/${name}`
        )

      setMessage(response.data.message)
      setMessageType('success')

      loadRegisteredFaces()

    } catch (error) {

      setMessage('Error deleting face')
      setMessageType('error')
    }
  }

  return (
    <div className="app-container">

      <div className="header">
        <h1>FaceCheck</h1>
        <p>
          Register and recognize faces
        </p>
      </div>

      <div className="dashboard">

        <div className="card">
          <h2>Live Camera</h2>

          <Webcam
            ref={setWebcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />

          <div className="button-group">

            <button
              className="btn btn-primary"
              onClick={captureImage}
            >
              Capture Image
            </button>

            <button
              className="btn btn-danger"
              onClick={clearImage}
            >
              Clear
            </button>

          </div>

          <br />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file =
                e.target.files[0]

              if (file) {

                const reader =
                  new FileReader()

                reader.onloadend =
                  () => {
                    setCapturedImage(
                      reader.result
                    )
                  }

                reader.readAsDataURL(
                  file
                )
              }
            }}
          />

        </div>

        <div className="card">
          <h2>Preview</h2>

          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="preview-image"
            />
          ) : (
            <p>
              Capture or upload an image
            </p>
          )}

          {recognitionResult && (
            <div className="result-card">
              <h3>
                ✅ Recognized:
              </h3>

              <p>
                <strong>Name:</strong>
                {' '}
                {recognitionResult.name}
              </p>

              <p>
                <strong>Confidence:</strong>
                {' '}
                {recognitionResult.confidence.toFixed(4)}
              </p>
            </div>
          )}

        </div>

        <div className="card full-width">

          <h2>
             Face Recognition
          </h2>

          <button
            className="btn btn-primary"
            onClick={recognizeFace}
            disabled={
              !capturedImage ||
              isRecognizing
            }
          >
            {
              isRecognizing
                ? 'Recognizing...'
                : 'Recognize Face'
            }
          </button>

        </div>

        <div className="card full-width">

          <h2>
             Register New Face
          </h2>

          <input
            className="input-box"
            type="text"
            placeholder="Enter person's name"
            value={registerName}
            onChange={(e) =>
              setRegisterName(
                e.target.value
              )
            }
          />

          <button
            className="btn btn-success"
            onClick={registerFace}
            disabled={
              !capturedImage ||
              !registerName.trim() ||
              isRegistering
            }
          >
            {
              isRegistering
                ? 'Registering...'
                : 'Register Face'
            }
          </button>

          {message && (
            <div
              className={`message ${
                messageType === 'success'
                  ? 'success'
                  : 'error'
              }`}
            >
              {message}
            </div>
          )}

        </div>

        <div className="card full-width">

          <h2>
             Registered Faces
          </h2>

          {
            registeredFaces.length === 0
              ? (
                <p>
                  No faces registered
                </p>
              )
              : (
                <div className="faces-grid">

                  {registeredFaces.map(
                    (
                      name,
                      index
                    ) => (
                      <div
                        key={index}
                        className="face-card"
                      >

                        <span>
                          {name}
                        </span>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteFace(
                              name
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    )
                  )}

                </div>
              )
          }

        </div>

      </div>

    </div>
  )
}

export default App