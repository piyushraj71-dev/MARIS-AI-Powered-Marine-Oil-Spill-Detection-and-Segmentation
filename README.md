
# MARIS — AI-Powered Marine Oil Spill Detection and Segmentation

**MARIS (Maritime AI for Remote-sensing Intelligence System)** is an AI-powered system for detecting and segmenting potential oil spills in satellite imagery using deep learning.

The system primarily uses Sentinel-1 SAR imagery and a two-stage AI pipeline:

**Classification → Segmentation → Spill Analysis**

MARIS includes a FastAPI backend and an interactive web dashboard that allows users to upload satellite images, test sample images, and view prediction results, segmentation masks, overlays, and spill measurements.


## 🌐 Live Demo

Try the deployed MARIS application:

- **Web Dashboard:** https://maris-oil-spill-api.onrender.com
- **API Documentation (Swagger):** https://maris-oil-spill-api.onrender.com/docs
- **API Health Check:** https://maris-oil-spill-api.onrender.com/health

Upload a satellite image or select a sample image to test the oil spill detection and segmentation pipeline.

## 🚀 Features

- 🛰️ Oil spill detection from Sentinel-1 SAR imagery
- 🤖 Oil / No-Oil image classification
- 🎯 Pixel-level oil spill segmentation
- 📊 Spill area and area percentage estimation
- 📍 Spill centroid extraction
- 📦 Bounding box extraction
- 📐 Spill perimeter calculation
- 🖼️ Segmentation mask and overlay generation
- 🌐 Interactive web dashboard built with HTML, CSS, and JavaScript
- 🧪 Sample images for testing the prediction pipeline
- 🔌 REST API using FastAPI
- 📚 Interactive Swagger API documentation
- ☁️ Cloud deployment using Docker and Render

## 🧠 How It Works

MARIS uses a two-stage deep learning pipeline to detect and analyze potential oil spills.

```text
Satellite SAR Image
        ↓
Image Preprocessing
        ↓
Oil Spill Classification
        ↓
   Oil Detected?
      /      \
    No        Yes
    ↓          ↓
No Spill   Segmentation
              ↓
        Spill Mask
              ↓
       Spill Analysis
              ↓
      Visual and JSON Results
```

## 🛰️ Satellite Data

MARIS uses **Synthetic Aperture Radar (SAR)** satellite imagery for oil spill detection and segmentation.

The project primarily uses **Sentinel-1 SAR imagery**. These images contain grayscale radar backscatter information that can help identify surface features on the ocean that may correspond to oil spills.

SAR is particularly useful for maritime monitoring because it can capture images during both day and night and does not depend on sunlight or clear-sky conditions.

> **Note:** The current MARIS demo does not use a separately provided VV/VH polarization dataset.

## 🤖 Deep Learning Models

MARIS uses two separate **TensorFlow/Keras deep learning models** for oil spill analysis.

### 🔹 1. Oil Spill Classification Model

The classification model predicts whether the input SAR image contains an oil spill.

- **Architecture:** MobileNetV2 with fine-tuning
- **Input:** 224 × 224 grayscale SAR image
- **Output:** Oil Spill / No Oil Spill classification and oil probability
- **Purpose:** Initial screening of satellite imagery
- **Saved Model:** `oil_spill_model.keras`

### 🔹 2. Oil Spill Segmentation Model

The segmentation model identifies the potential oil spill region at the pixel level.

- **Architecture:** U-Net
- **Input:** SAR image
- **Output:** Pixel-level oil spill mask
- **Purpose:** Locate and delineate the detected spill region
- **Saved Model:** `best_unet_oilspill.keras`

### 🔄 Model Pipeline

**SAR Image → Classification → Oil Spill Detected → Segmentation → Spill Mask → Spill Measurements**

If the classification model predicts **No Oil Spill**, the segmentation stage is skipped.

## 📊 Datasets & Attribution

MARIS uses publicly available SAR oil spill datasets for model training and evaluation.

### 🔹 1. Sentinel-1 SAR Oil Spill Detection Dataset

Used primarily for oil spill classification.

- **Source:** Kaggle
- **Dataset:** Sentinel-1 SAR Oil Spill Detection Dataset
- **Image Type:** Grayscale SAR images
- **Classes:** Oil Spill / No Oil Spill

🔗 **Dataset:** https://www.kaggle.com/datasets/harikrishnacs/sentinel-1-sar-oil-spill-detection-dataset

### 🔹 2. Deep-SAR SOS Oil Spill Detection Dataset

Used for oil spill segmentation with pixel-level masks.

- **Source:** Kaggle
- **Dataset:** Deep-SAR SOS Oil Spill Detection Dataset
- **Satellite Data:** Sentinel-1 and PALSAR SAR imagery
- **Labels:** Pixel-level segmentation masks

🔗 **Dataset:** https://www.kaggle.com/datasets/bitsandlayers/sar-oil-spill-segmentation-dataset-sos

### 📌 Attribution

The datasets are publicly available and used for research and educational purposes. Dataset ownership and licensing remain with the respective original creators and sources. Refer to each dataset's page for its specific terms.

## 📁 Project Structure

```text
MARIS/
│
├── ai_models/
│   ├── oil_spill_model.keras
│   └── best_unet_oilspill.keras
│
├── api/
│   ├── __init__.py
│   └── main.py
│
├── inference/
│   ├── pipeline.py
│   ├── preprocessing/
│   ├── postprocessing/
│   └── output/
│
├── sample_images/
│   └── Sample SAR images for testing
│
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── training/
│   ├── classification_training.ipynb
│   └── segmentation_training.ipynb
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── requirements.txt
└── README.md
```

*Note: This is a representative structure. Keep it consistent with the files actually present in the repository. Large model files may need to be stored separately if they exceed GitHub's file-size limits.*

## 🛠️ Tech Stack

### 🔹 Machine Learning & Deep Learning
- **Python**
- **TensorFlow / Keras**
- **MobileNetV2** — Image classification
- **U-Net** — Oil spill segmentation
- **NumPy** — Numerical processing
- **Pillow (PIL)** — Image loading and processing

### 🔹 API & Backend
- **FastAPI** — API development
- **Uvicorn** — ASGI server

### 🔹 Frontend
- **HTML** — Web page structure
- **CSS** — Dashboard styling
- **JavaScript** — Image upload, sample selection, and API interaction

### 🔹 Deployment
- **Docker** — Containerization
- **Render** — Cloud deployment

### 🔹 Development & Training
- **Google Colab** — Model training
- **Jupyter Notebook** — Training experiments
- **Git & GitHub** — Version control and project management

## ☁️ Deployment

MARIS is designed to run as a containerized FastAPI application, with the web dashboard served by the backend.

### 🔹 Deployment Platform

- **Platform:** Render
- **Containerization:** Docker
- **Backend:** FastAPI
- **Server:** Uvicorn

### 🔗 Live Application

- **Web Dashboard / API:** https://maris-oil-spill-api.onrender.com
- **Swagger Documentation:** https://maris-oil-spill-api.onrender.com/docs
- **Health Check:** https://maris-oil-spill-api.onrender.com/health

*The live dashboard and newly added sample-image endpoints should be verified after deployment.*

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Opens the web dashboard |
| `GET` | `/health` | Checks whether the API is running |
| `POST` | `/predict` | Uploads an image and performs oil spill detection and segmentation |
| `GET` | `/samples` | Lists available sample images |
| `GET` | `/samples/{filename}` | Retrieves a sample image |
| `GET` | `/result/{job_id}/{filename}` | Retrieves an available prediction output |
| `GET` | `/docs` | Opens interactive Swagger documentation |

## 🌐 Web Dashboard

The MARIS dashboard provides a user-friendly interface for testing the oil spill detection pipeline.

Users can:

- Upload a supported image in JPG, JPEG, or PNG format.
- Select an image from the available sample images.
- Submit an image for prediction.
- View the classification result and oil probability.
- Inspect the generated segmentation mask and overlay when available.
- Review spill measurements and the JSON result.

The dashboard communicates with the FastAPI backend, which executes the existing inference pipeline.

## 📚 API Documentation

MARIS provides interactive API documentation through Swagger UI.

🔗 **Swagger UI:** https://maris-oil-spill-api.onrender.com/docs

Users can use the Swagger interface to:

- Upload an image to the `/predict` endpoint.
- Submit prediction requests.
- Inspect JSON responses.
- Test the health endpoint.
- Explore the API schemas.

## 📦 Example API Request

The `/predict` endpoint accepts a supported image as a file upload.

Users can submit an image through the Swagger interface or the web dashboard:

https://maris-oil-spill-api.onrender.com/docs

The image is processed by the MARIS inference pipeline, which performs classification and, when an oil spill is detected, segmentation.

## 📦 Example API Response

The following is an illustrative example of a prediction response. Actual values depend on the input image and model output.

```json
{
  "job_id": "703a83c3",
  "result": {
    "oil_probability": 0.6650543808937073,
    "spill_area": {
      "oil_pixels": 9290,
      "area_percentage": 14.1754150390625
    },
    "centroid": {
      "x": 81.19,
      "y": 168.08
    },
    "bounding_box": {
      "x_min": 0,
      "y_min": 38,
      "x_max": 168,
      "y_max": 255
    },
    "perimeter": 890,
    "result": "OIL_DETECTED"
  }
}
```

The actual API response also includes the available output-file links, depending on the result.

### 🔹 Generated Outputs

- **Predicted Mask:** Pixel-level region identified as a potential oil spill.
- **Overlay:** Visualization of the predicted region over the input image.
- **JSON Result:** Prediction information and spill measurements.

## 🖼️ Outputs

MARIS produces visual and numerical outputs from the input image.

### 🔹 Visual Outputs

- **Original SAR Image** — The uploaded satellite image.
- **Segmentation Mask** — Pixel-level predicted spill region.
- **Overlay Image** — The predicted region displayed over the original image.

### 🔹 Numerical Outputs

- **Oil Spill Prediction** — Oil Detected / No Oil
- **Oil Probability** — Model output probability
- **Spill Area** — Number of predicted spill pixels
- **Area Percentage** — Percentage of the image covered by the predicted region
- **Centroid** — Center coordinates of the predicted region
- **Bounding Box** — Coordinates enclosing the predicted region
- **Perimeter** — Perimeter of the predicted region

> **Measurement note:** Unless the imagery is calibrated and georeferenced, these measurements describe the predicted region in image coordinates or pixels. They should not be interpreted as real-world geographic area or location.

## 🎯 Project Goal

The goal of MARIS is to provide an AI-powered system for automated oil spill detection and segmentation from SAR satellite imagery.

The detection module aims to:

- Detect potential oil spills in satellite images.
- Identify the predicted spill region at the pixel level.
- Generate segmentation masks and visual overlays.
- Extract quantitative image-based spill measurements.
- Provide results through an API and interactive dashboard.

This detection module forms the **DETECT** stage of the broader MARIS concept for maritime oil spill monitoring.

## 🔮 Future Improvements

- Improve model performance with larger and more diverse SAR datasets.
- Support additional SAR satellite sources and polarization information.
- Improve segmentation accuracy under complex ocean conditions and look-alikes.
- Enhance spill shape and boundary analysis.
- Integrate satellite data for automated monitoring.
- Connect the detection system with oil spill drift and hindcasting models.
- Integrate AIS vessel data for potential source-vessel attribution.
- Add uncertainty estimation to detection and segmentation outputs.
- Expand interactive geospatial visualization capabilities.

## 📄 License

This project is intended for research, learning, and demonstration purposes.

The datasets used by MARIS are subject to their respective licenses and attribution requirements. Please refer to the original dataset sources for their specific terms.

Add an explicit software license to the repository if you intend to distribute or permit reuse of the code.
