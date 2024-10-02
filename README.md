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
   Edit `src/environments/environment.ts` in the frontend directory with:
   ```typescript
   export const environment = {
     production: false,
     endpoint: 'http://localhost:3001',
     mapboxKey: 'your_mapbox_token_here'
   };
   ```

5. Launch the application:
   ```bash
   ng serve --o
   ```

6. Visit `http://localhost:4200` in your browser!

## 🌈 Features Showcase

### 🖥️ Frontend Highlights

- **🗺️ Mapbox Integration**: Explore interactive maps with custom markers.
- **📅 FullCalendar Integration**: Manage events with an intuitive modal interface for creation and deletion.
- **📊 Chart.js Integration**: Visualize user team categories with stunning charts.

### ⚙️ Backend Capabilities

- **👥 User Management**: Full CRUD operations for user data.
- **🎉 Event Management**: Comprehensive CRUD functionality for event handling.
- **📍 Marker Management**: Complete CRUD operations for map markers.

