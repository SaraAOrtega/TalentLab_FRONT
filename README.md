# 🚀 Angular 18 Fullstack Project: Plataforma Talent Lab


## 🌟 Project Overview

Talent Lab is presented as a platform for production companies to conduct more efficient searches for actors and actresses. It is designed to be developed by Talent Agencies to provide their clients (production companies) with a more efficient service for finding the necessary talent for audiovisual productions, especially in advertising.

The platform has been developed with:

- **🖥️ Frontend**: Angular 18 using the Mapbox API.
- **⚙️ Backend**:  Node.js using Express and connected to a MySQL database.



## 🛠️ Prerequisites

To start the project, it is necessary to have the following installed:

- Node.js (version 16.x or newer)
- npm (version 7.x or newer)
- Angular CLI (version 18.x or newer)

## 📁 Repository Structure

The project is divided into two repositories:

- **Frontend**: [Explore TalentLab_FRONT](https://github.com/SaraAOrtega/TalentLab_FRONT)
- **Backend**: [Explore TalentLab_BACK](https://github.com/SaraAOrtega/TalentLab_BACK)

Please clone each repository and follow the setup instructions below.

## 🚀 Getting Started

### 🔧 Setting Up the Backend

1. Clone the backend repository:
   ```bash
   git clone https://github.com/SaraAOrtega/TalentLab_BACK.git
   cd TalentLab_BACK
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Import the demo database:
   Locate the `talentlab_db.sql` file in the Backend folder and import it into your MySQL server.

4. Compile TypeScript:
   ```bash
   tsc --w
   ```

5. Launch the server:
   ```bash
   nodemon dist/index.js
   ```

### 🎨 Preparing the Frontend

1. Clone the frontend repository:
   ```bash
   git clone https://github.com/SaraAOrtega/TalentLab_FRONT.git
   cd TalentLab_FRONT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Secure a Mapbox API token from [Mapbox](https://account.mapbox.com/access-tokens/).

4. Set up your environment:
   Create `src/app/environments/mapbox-config.ts` in the frontend directory with:
   ```typescript
  export const mapboxConfig = {
  apiKey: 'YOUR MAPBOX KEY'
};
   ```

5. Launch the application:
   ```bash
   ng serve --o
   ```

6. Visit `http://localhost:4200` in your browser!


## 🌈 On this link you'll find the website's homepage (https://talent-lab-one.vercel.app/home),

## 🌈 And ScreenShots

<p float="left">
  <img src="images/screenshot1.png" width="100" />
  <img src="images/screenshot2.png" width="100" />
  <img src="images/screenshot3.png" width="100" />
  <img src="images/screenshot4.png" width="100" />
  <img src="images/screenshot5.png" width="100" />
  <img src="images/screenshot6.png" width="100" /> 
  <img src="images/screenshot7.png" width="100" />
  <img src="images/screenshot8.png" width="100" />
  <img src="images/screenshot9.png" width="100" />
</p>







