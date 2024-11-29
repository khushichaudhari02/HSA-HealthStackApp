# HSA (Health Stack App) 🩺

Welcome to **HSA (Health Stack App)**! Our comprehensive health application is designed to manage all aspects of health data, providing real-time tracking and analysis for users. With an array of features and functionalities, we've redefined health management.

## Video 📽️

Coming soon!

## Screenshots 📸

For a detailed view of the application's interface, please refer to the screenshots included in the PDF [here](Screenshots.pdf).


## Features

### 1. SuperAdmin Panel
- **Hospital Management:** Create new hospitals, view existing hospitals, and see requests for creating new hospitals and admins.
- **Admin Creation:** Create new admins for specific hospitals, allowing for tailored management.
- **Note:** The SuperAdmin Panel cannot be shown here as it contains sensitive administrator functionalities.

### 2. Admin Panel
- **Appointment Management:** Approves appointment booking requests from patient users.
- **Fee Management:** View the fee list for a particular doctor and details of the fees.
- **Doctor Schedule Management:** View the doctor's schedule for specific dates and shifts, and manage booking approvals.
- **Staff Management:** Create other staff users such as nurses, receptionists, and doctors. (This feature is still a work in progress.)

### 3. Doctor Panel
- **Schedule Management:** View the current schedule and check schedules by date and shift.
- **Patient Information:** Access patient details and past appointments.
- **Fee Details:** View details related to fees for services provided.
- **Profile Management:** Adjust the profile with education details, appointment duration, shifts, and off days.

### 4. Patient Panel
- **Appointment History:** View past appointments.
- **Notifications:** Receive basic notifications regarding appointment status and updates.
- **Appointment Booking:** Book new appointments by searching for a city, selecting hospitals and doctors, and inputting the desired time and date.
- **Profile Management:** Update profile with health-related data such as height, weight, age, and sex.

## Notification System
- Admins receive basic notifications after the completion of appointments, indicating that the appointment is done and that payment has been received from the patient. Detailed notifications are yet to be developed.

## Upcoming Ideas
- **Map and Route Functionality:** Adding a map feature to enhance navigation.
- **Improved Notifications:** Developing detailed notifications for users and admins.
- **Lab Integration:** Creating a lab side of the application (currently incomplete).
- **Staff Dashboard:** Developing a improved dashboard for staff management.
- **PDF Generation:** Generating PDFs for receipts, prescriptions, and reports.
- **Fees Enhancement:** Improving the fees section with detailed analytics and insights.

## Tech Stack

- **MEVN (End to End):** Utilizing MongoDB, Express.js, Vue.js, and Node.js for a robust full-stack solution.
- **Vue.js:** Leveraging Vue.js along with Vuex and Vue Router for a dynamic frontend experience.
- **Styling:** Tailored CSS has been applied to create an intuitive and attractive user interface that enhances the overall user experience.
- **API:** Built to facilitate seamless management of health data and enhance user experience.

## Installation

### Running the Project Locally

To run the project locally, you need only the backend development and frontend:

1. Navigate to the `HSA Backend Dev` directory:
   ```bash
   cd HSA_Backend_Dev
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

4. Navigate to the `Production Frontend` directory:
   ```bash
   cd Production_Frontend
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the frontend server:
   ```bash
   npm start
   ```

### Using Transaction Features with MongoDB Atlas

If you want to utilize the transaction feature, you must use MongoDB Atlas along with the production backend build:

1. Navigate to the `HSA Production Backend Build` directory:
   ```bash
   cd HSA_Production_Backend_Build
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

4. Navigate to the `Production Frontend` directory:
   ```bash
   cd Production_Frontend
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the frontend server:
   ```bash
   npm start
   ```

## Contributors

- [Asad Patel](https://github.com/asad2050)
- [Aditya Pandey](https://github.com/Adityapandey06)
- [Khushi Chaudhari](https://github.com/khushichaudhari02)
- [Kaif Raza Shaikh](https://github.com/kaif2011)


## Notes ⚠️

- The lab report feature is currently incomplete.
- Notifications are basic and lack detailed information.

Happy coding! 🌟
