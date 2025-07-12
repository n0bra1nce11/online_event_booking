# EventsNepal Admin Dashboard

## Overview

The EventsNepal Admin Dashboard is a web-based application designed for event administrators to manage events, validate tickets, scan QR codes, and view event statistics. Built with HTML, CSS, JavaScript, and integrated with a Node.js/PostgreSQL backend, it provides a responsive and secure interface for event management.

## Features

- **Ticket Validation**: Validate tickets using booking IDs with PKI-based verification.
- **QR Code Scanning**: Scan QR codes to check in tickets using the device's camera.
- **Event Creation**: Create new events with details such as name, date, description, ticket count, and banner image.
- **Event Statistics**: View real-time statistics on ticket sales and revenue.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Secure Authentication**: Uses JWT-based authentication with token storage in `localStorage`.

## Prerequisites

- **Node.js**: Version 14.x or higher
- **PostgreSQL**: Version 12.x or higher
- **Web Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**:
  - Font Awesome 6.4.2 (via CDN)
  - jsQR 1.4.0 (via CDN)
  - QRCode.js 1.0.0 (via CDN)
  - SheetJS (XLSX) 0.18.5 (via CDN)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/eventsnepal-admin.git
   cd eventsnepal-admin
   ```

2. **Set Up the Backend**:
   - Ensure the Node.js backend is running with a PostgreSQL database.
   - Configure the database connection in the backend's configuration file (e.g., `.env`).
   - Example `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/eventsnepal
     JWT_SECRET=your_jwt_secret
     ```

3. **Serve the Frontend**:
   - Place `dashboard.html` in the appropriate directory served by your backend (e.g., `public/` or `static/`).
   - Alternatively, use a static file server:
     ```bash
     npm install -g serve
     serve -s .
     ```

4. **Install Backend Dependencies** (if applicable):
   ```bash
   npm install
   ```

5. **Start the Backend**:
   ```bash
   npm start
   ```

6. **Access the Dashboard**:
   - Open your browser and navigate to `http://localhost:3000/dashboard.html` (adjust port as needed).
   - Log in with admin credentials to obtain a JWT token.

## Usage

1. **Login**:
   - Access the admin login page (`admin.html`) and authenticate to receive a JWT token, stored in `localStorage`.

2. **Dashboard Navigation**:
   - **Validate Ticket**: Enter a booking ID (e.g., `EVENTNP_01`) to verify ticket details and generate a QR code.
   - **Scan QR Code**: Start the QR scanner to check in tickets using the device's camera.
   - **Create Event**: Fill in event details and upload a banner image to create a new event.
   - **Event Statistics**: View real-time statistics for all events, including total tickets, tickets sold, and revenue.

3. **Logout**:
   - Click the "Logout" button to clear the token and return to the login page.

## API Endpoints

The dashboard interacts with the following backend API endpoints:

- **POST /api/tickets/validate**: Validates a ticket by booking ID.
  - Request: `{ booking_id: string, private_key: string }`
  - Response: `{ valid: boolean, event: string, booking: object, error?: string }`
- **POST /api/tickets/scan**: Validates a ticket via QR code scan.
  - Request: `{ booking_id: string }`
  - Response: `{ message: string, event: string, booking: object, error?: string }`
- **POST /api/tickets/send-email**: Sends a ticket email.
  - Request: `{ booking_id: string, email: string }`
  - Response: `{ message: string, error?: string }`
- **POST /api/tickets/check-in**: Checks in a ticket.
  - Request: `{ booking_id: string }`
  - Response: `{ message: string, error?: string }`
- **POST /api/events/create**: Creates a new event.
  - Request: FormData with `name`, `date`, `description`, `total_tickets`, `banner`
  - Response: `{ id: string, error?: string }`
- **GET /api/events/stats**: Retrieves event statistics.
  - Response: Array of `{ name: string, total_tickets: number, tickets_sold: number, total_sales: number }`

## Security Considerations

- **Authentication**: Ensure JWT tokens are validated on each API request.
- **HTTPS**: Serve the dashboard over HTTPS in production to secure data transmission.
- **Input Validation**: Client-side validation is implemented, but ensure server-side validation is robust.
- **File Uploads**: Validate and sanitize banner image uploads on the server to prevent security issues.
- **Camera Permissions**: QR scanning requires user permission; handle errors gracefully.

## Troubleshooting

- **Camera Not Working**: Ensure camera permissions are granted in the browser. Check for HTTPS in production.
- **API Errors**: Verify the backend server is running and the API endpoints are correctly configured.
- **Token Issues**: If redirected to `admin.html`, check if the JWT token is valid or expired.
- **Excel Processing**: Ensure `XLSX` library is loaded for any Excel file handling.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.