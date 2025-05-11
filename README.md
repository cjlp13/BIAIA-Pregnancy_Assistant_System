<p align="center"><img src="https://github.com/cjlp13/BIAIA-Pregnancy_Assistant_System/blob/main/public/biaia-light.svg" alt="Invertrix Logo"></p>
<h1 align="center">BIAIA: A Pregnancy Assistant</h1>
<p align="center">by <strong>Team 6</strong> 💕</p>

<details>
  <summary><strong>📖 Table of Contents</strong></summary>

1. [Project Overview](#-project-overview)
   - [Objectives](#-objectives)
   - [Technologies Used](#-technologies-used)
2. [Installation Instructions](#-installation-instructions)
3. [Usage Instructions](#-usage-instructions)
4. [Contributors](#-contributors)
5. [Course Instructor](#-course-instructor)
6. [Acknowledgment](#-acknowledgment)

</details>


## 🌸 Project Overview
**BIAIA** is a web app that assists pregnant individuals by offering features like AI-powered chat, appointment scheduling, clinic locator, weekly tracking, and journaling. It promotes health and well-being in line with UN Sustainable Development Goal #3.

<img src = "https://github.com/cjlp13/BIAIA-Pregnancy_Assistant_System/blob/main/public/Sustainable_Development_Goal_03GoodHealth.svg.png" width=150px height=150px>


### 🎯 Objectives  
- Promote holistic health and emotional support during pregnancy.  
- Consolidate various pregnancy-related features into a unified web platform.  
- Offer accessible, AI-powered assistance for common health concerns.  
- Make appointment scheduling and clinic location easy and intuitive.  
- Encourage self-reflection and mood tracking via journaling features.

### ⚙ Technologies Used

| Category              | Technologies                                                                                                                                                   |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend**          | [![React][react]][react-url] [![Next.js][next]][next-url] [![TypeScript][ts]][ts-url] [![Tailwind][tailwind]][tailwind-url]                                   |
| **Backend & Database**| [![Next.js API Routes][api]][api-url] [![Supabase][supabase]][supabase-url]                                                                                |
| **APIs**              | [![Gemini AI][gemini]][gemini-url] [![Foursquare API][foursquare]][foursquare-url] [![Mapbox][mapbox]][mapbox-url]             |

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
### 1. **Access the App**  
Visit [https://biaia.vercel.app/](https://biaia.vercel.app/) or follow the install guide.

### 2. **Register**  
- Click **Register** and fill in (example):  
  - *Name*: Maria Santos  
  - *Email*: maria@example.com  
  - *Password*: securePass123  
  - *EDD*: 2025-10-10  
- Click **Submit** and confirm your email.  
- ✅ You’ll be redirected to the dashboard.

### 3. **Login**  
- Enter your credentials and click **Login**.  
- ✅ You’ll land on your personalized dashboard.

### 4. **Dashboard**  
- Shows:  
  - 🍼 Pregnancy week (e.g., Week 18)  
  - ✅ Upcoming appointments  
  - 🧘 Tips, safe exercises, and quick access links

### 5. **Tracker**  
- Auto-updates with your current week.  
- Example (Week 18):  
  - *Baby*: Size of a sweet potato  
  - *Mom*: May feel first movements  
  - *Tip*: Sleep on your side

### 6. **Chatbot (Chat Page)**  
- Type a question like:  
  - `"What are the symptoms of gestational diabetes?"`  
- **Expected Output** (from Gemini API):  
  - "Common symptoms include increased thirst, frequent urination, and fatigue. Please consult your doctor for a proper diagnosis."

### 7. **Journal**  
- Click “Add Entry”.  
- Input:  
  - **Title**: *Feeling Kicks!*
  - **Date**: *2025-06-20* 
  - **Description**: *Felt small fluttering movements today!*  
  - **Mood**: Positive (9)  
- Click “Save”.  
- ✏️ Entry is now visible in the Journal with edit and delete options.

### 8. **Appointments**  
- Click “Add Appointment”.  
- Input:  
  - **Title**: *Visit St. Luke’s Medical Center*
  - **Date**: *2025-06-20* 
  - **Time**: *10:00 AM*   
  - **Notes**: *Ultrasound Checkup*  
- Click “Save”.  
- ✏️ Appointment appears with edit and delete options.
- 🔍 You may also use the **Find Clinics** section:  
  - Input: *“Quezon City”*, Category: OB-GYN Clinic
  - Output: Displays a list of nearby OB-GYN clinics.
  - Click on Get Directions to open its location in Google Maps.

### 9. **Logout**  
- Click your profile/menu icon → **Logout** to end your session.

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

[react]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black  
[react-url]: https://reactjs.org/  

[next]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white  
[next-url]: https://nextjs.org/  

[ts]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white  
[ts-url]: https://www.typescriptlang.org/  

[tailwind]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white  
[tailwind-url]: https://tailwindcss.com/  

[api]: https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=nextdotjs&logoColor=white  
[api-url]: https://nextjs.org/docs/api-routes/introduction  

[supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white  
[supabase-url]: https://supabase.com/  

[gemini]: https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white  
[gemini-url]: https://deepmind.google/technologies/gemini/  

[foursquare]: https://img.shields.io/badge/Foursquare-FA4778?style=for-the-badge&logo=foursquare&logoColor=white  
[foursquare-url]: https://developer.foursquare.com/  

[mapbox]: https://img.shields.io/badge/Mapbox-4264FB?style=for-the-badge&logo=mapbox&logoColor=white  
[mapbox-url]: https://www.mapbox.com/

---


