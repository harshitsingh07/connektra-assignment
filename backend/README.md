# Backend - ACC Image Upload Service

This is the backend service for the ACC Integration assignment. It exposes a webhook endpoint that receives image files and uploads them to Autodesk Construction Cloud (ACC) Photos module using Autodesk Platform Services (APS) APIs.

---

## 📦 Features

- Webhook endpoint to receive image, tags, and description
- Supports `multipart/form-data` upload
- Uploads image to specified ACC project and folder
- Authenticates using Autodesk 3-legged OAuth (client_credentials)
- Uses APS Data Management API to create storage object, signed URL, and file version

---

## 🚀 How to Run

### 1. Run it locally
- npm install all the dependency

### 2. Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
APS_CLIENT_ID=your-client-id
APS_CLIENT_SECRET=your-client-secret
PORT=5000
```

### 3. Install Dependencies (to re-check if everything is installed)

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

The backend server runs at [http://localhost:5000](http://localhost:5000)

---

## 🔗 Webhook Endpoint

### `POST /webhook`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `image`: (required) The image file (PNG, JPEG, etc.)
- `tags`: (optional) JSON string or comma-separated tags
- `text`: (optional) Image description
- `project_id`: (required) The ACC project ID
- `folder_path`: (required) The target folder ID (used as suffix in URN)

### 🧪 Example `curl`

```bash
curl -X POST http://localhost:5000/webhook \
  -F "image=@./sample.jpg" \
  -F "tags=site,inspection" \
  -F "text=Routine inspection photo" \
  -F "project_id=b.1234567890abcdef" \
  -F "folder_path=xyzfolderid"
```

---

## 📂 File Structure

```
backend/
├── index.ts         # Entry point, sets up Express server
├── upload.ts        # Handles interaction with ACC APIs
├── auth.ts          # Retrieves and caches APS access token
├── types.ts         # TypeScript interfaces for structured data
├── .env.example     # Sample environment variables
```

---

## 📌 Notes

- Assumes Autodesk credentials are correctly provisioned
- Assumes folder URNs are known or predictable (`urn:adsk.wipprod:fs.folder:co.{folderPath}`)
- Error handling included, logs failures to console

---
