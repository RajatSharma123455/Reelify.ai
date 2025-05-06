# Project Title
This project uses AI-based image-to-video conversion to generate videos based on a user's uploaded image and their desired video scene idea. The process leverages the aivideoapi.com API, utilizing a pre-trained AI model (e.g., gen4 model) to convert images to videos.

## AI Model: gen4 (aivideoapi.com)
The AI model chosen for this project is the gen4 model from aivideoapi.com. This model specializes in generating video content from a single image.

### Why the gen4 Model?
High-quality video generation: The gen4 model produces realistic and visually appealing video content based on an image and prompt.

- Faster generation: The model is optimized for speed, meaning videos can be generated faster, especially in an asynchronous pipeline.

- Flexible: It allows several configuration options (e.g., motion, seed) that can help tailor the video generation to meet different user needs.

## How the Pipeline Works
### Frontend (React App):

- User uploads an image: A user selects an image file from their computer (Note- upload only 1280 X 720 px) otherwise it model cannot recognize the image because this model only works with lanscape(1280 x 720 px) or portait(720 x 1280).

- Image-to-Base64 conversion: The image is converted to a base64 string and sent to the backend.

### Backend (Express Server):

- The backend receives the base64 image via a POST request.

- A UUID is generated to track the task in the queue.

- The backend makes an GET API request to aivideoapi.com to trigger the video generation.

- The backend periodically checks the status of the video generation using the UUID.

- Once the status is successful, the video URL is returned to the frontend.

#### Frontend (React):

- The frontend polls the backend at regular intervals to check if the video has been generated.

- Once the video is ready, it is displayed on the frontend using a <video> element.

## Limitations:

- The aivideoapi.com API might have rate limits, so I am only using free credits of it. Each account have free 5 API call credits for one time, due to which it could potentially lead to throttling or blocking or not able to download the image.

- It may take a few minutes for the video to be generated, depending on server load.

### Image Quality:

- High-quality images typically result in better video output. However, low-resolution images may generate suboptimal video results.

### Internet Connection:

- Since the process relies on API calls and cloud-based video generation, a stable internet connection is required for both the frontend and backend to function correctly.

### File Size:

- Large image files may affect the performance of both the image upload process and video generation. Image size should be optimized for better performance.

### Backend Processing:

- The backend periodically checks the video generation status, which means the user will need to wait for some time (typically a few minutes) until the video is ready for download.

## Setup Instructions
 ### Prerequisites
 
Node.js (v14 or later)

MongoDB running locally or remotely (e.g., MongoDB Atlas)

.env file with necessary keys

### 1. Clone the Repository
git clone https://github.com/RajatSharma123455/Reelify.ai.git

1. Backend:
In the backend folder, run:
npm install

2. Frontend:
In the frontend folder (React app), run:
npm install

3. Set Up Environment Variables
   
4. In the of the project, create a .env file with the following content:

#### .env (root directory)
API_KEYS=<your-api-key-for-aivideoapi.com>

PORT=3000

5. Start the Backend Server
   
Navigate to the backend directory and start the server:

cd Reelify backend

npm run start

This will run the backend on http://localhost:3000.

6. Start the Frontend React App
   
Navigate to the frontend directory and start the React development server:

cd Reelify

npm run start

This will start the frontend app on http://localhost:5173.

7. Testing the Application
 
Open the React frontend in your browser (http://localhost:5173).

- Upload an image from device and click on convert to video

- The backend will start the image-to-video generation process, and the status will be updated regularly.

- Once the video is ready, it will be shown on the frontend.


