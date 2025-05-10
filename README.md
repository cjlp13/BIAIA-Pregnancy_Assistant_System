<p align="center"><img src="https://github.com/cjlp13/BIAIA-Pregnancy_Assistant_System/blob/main/public/biaia-light.svg" alt="Invertrix Logo"></p>
<h1 align="center">BIAIA: A Pregnancy Assistant</h1>
<p align="center">by <strong>Team 6</strong> 💕</p>

## 🌸 Project Overview
**BIAIA** is a web app that assists pregnant individuals by offering features like AI-powered chat, appointment scheduling, clinic locator, weekly tracking, and journaling. It promotes health and well-being in line with UN Sustainable Development Goal #3.

### 🎯Objectives  
- Promote holistic health and emotional support during pregnancy.  
- Consolidate various pregnancy-related features into a unified web platform.  
- Offer accessible, AI-powered assistance for common health concerns.  
- Make appointment scheduling and clinic location easy and intuitive.  
- Encourage self-reflection and mood tracking via journaling features.

### ⚙️ Technologies Used
- **Frontend**: React, Next.js
- **Language:** TypeScript  
- **Database and Backend**: Supabase
- **Styling**: Tailwind CSS
- **APIs**:
  - **Gemini AI** — Powers the AI chatbot that provides conversational pregnancy-related guidance and emotional support.
  - **Foursquare API** — Helps locate nearby OB-GYN clinics and healthcare facilities based on user location input.
  - **Mapbox API** — Offers real-time location autocomplete and returns precise geocoordinates for maps and directions.
  - **Supabase:** Handles user authentication and stores users, journal entries, appointments, and other data.

##  🌸 Installation Instructions

You can access the web app online at [**https://biaia.vercel.app/**](https://biaia.vercel.app/). Upon signing up, you’ll receive a confirmation email.

If you prefer to run the web app locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/cjlp13/BIAIA-Pregnancy_Assistant_System
    ```

2. **Install the required dependencies:**

    ```bash
    npm install react-day-picker@latest
    npm install
    ```

3. **Set up environment variables:**  
   Download the `.env.local` file from this [Google Drive folder](https://drive.google.com/drive/folders/1ecKKWvv0CaN3ee86KD6KzQSfBND3tuLs) to access the API keys.  
   > ⚠️ Access is restricted to authorized members only.  
   Place the file in the root directory of the project.

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. **Access the app:**  
   Open your web browser and navigate to the IP address shown in your terminal. The app should now be running locally.

## 🌸 Usage Instructions

Follow these detailed steps to use BIAIA, with sample inputs and expected outputs:

### 1. **Access the Application**  
Visit: [https://biaia.vercel.app/](https://biaia.vercel.app/) or follow the installation instructions.

### 2. **Register a New Account**  
- Click “Register”.  
- Example input details:  
  - **Name**: *Maria Santos*  
  - **Email**: *maria@example.com*  
  - **Password**: *securePass123*  
  - **Expected Delivery Date**: *2025-10-10*  
- Click **Submit**.  
- ✅ *You will receive a confirmation email. Once confirmed, you’ll be redirected to the dashboard.*

### 3. **Login to the System**  
- Enter your registered email and password.  
- Click **Login**.  
- ✅ *You’ll be taken to the Dashboard.*

---

### 4. **Dashboard**  
- Displays:  
  - 🍼 Current Pregnancy Week (e.g., Week 18) and details
  - ✅ Upcoming Appointments
  - 🧘 Safe exercises, tips, shortcut for other features of the app

### 5. **Weekly Tracker**  
- Automatically shows current week milestones and overview.  
- **Example Output**:  
  - **Week 18**  
    - *Baby*: "Your baby is the size of a sweet potato."  
    - *Mom*: "You may start feeling the baby move."  
    - *Advice*: "Sleep on your side and stay hydrated."

### 6. **Chatbot (Chat Page)**  
- Type a question like:  
  - `"What are the symptoms of gestational diabetes?"`  
- **Expected Output** (from Gemini API):  
  - "Common symptoms include increased thirst, frequent urination, and fatigue. Please consult your doctor for a proper diagnosis."

### 7. **Journal**  
- Click “Add Entry”.  
- Input:  
  - **Title**: *Feeling Kicks!*  
  - **Description**: *Felt small fluttering movements today!*  
  - **Mood**: Positive (9)  
- Click “Save”.  
- ✅ Entry is now visible in the Journal with edit and delete options.

### 8. **Appointments**  
- Click “Add Appointment”.  
- Input:  
  - **Title**: * Visit St. Luke’s Medical Center*  
  - **Date**: *2025-06-20*  
  - **Time**: *10:00 AM*  
  - **Notes**: *Ultrasound Checkup*  
- ✅ Appointment appears on dashboard.

- You may also use the location input:  
  - Input: *“Quezon City”*  
  - Output: Displays a list of nearby OB-GYN clinics using **Foursquare + Mapbox**.  
  - Click on a clinic to open its location in Google Maps.

### 9. **Logout**  
- Click on your profile or menu icon.  
- Select “Logout” to end your session.

## 🌸 Contributors
* [Justine Padua](https://github.com/cjlp13) 
* [Viviene Garcia](https://github.com/VivieneGarcia)  
* [Elwin Barredo](https://github.com/elwintheDEVisor) 
* [John Yumul](https://github.com/John-Yumul)  

## 🌸 Course Instructor 
* [Ma'am Fatima](https://github.com/marieemoiselle) - CS 322: Software Engineering Course Instructor
  
## 🌸 Acknowledgment
* We sincerely thank Ma'am Fatima for her detailed modules, clear instructions, and consistent guidance throughout the development of this project. Her structured approach made it easier for us to understand software engineering concepts and apply them effectively in building BIAIA.  
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=900&size=19&pause=1000&color=F655A6&width=435&lines=Thank+you!+%F0%9F%8C%B7%F0%9F%8C%B7%F0%9F%8C%B7" alt="Typing SVG" /></a>


<h3 align="center">🌸🌸🌸</h3>

---


