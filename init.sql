CREATE DATABASE eventsnepal;

\c eventsnepal;

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  total_tickets INTEGER NOT NULL,
  tickets_sold INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  banner_image VARCHAR(255),
  available BOOLEAN NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(10) UNIQUE NOT NULL,
  event_id INTEGER REFERENCES events(id),
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  email_address VARCHAR(100) NOT NULL,
  ticket_quantity INTEGER NOT NULL,
  signature TEXT NOT NULL,
  consumed BOOLEAN DEFAULT false
);

-- Insert mock data
INSERT INTO admins (username, password) VALUES
  ('admin', '$2a$12$iK46oIpxFQz7.NcTP3TnbeOjZ6czbXbktVUhnsTMxrYtk1fQQfVMK');

INSERT INTO events (name, date, description, total_tickets, tickets_sold, total_sales, banner_image, available) VALUES
  ('Cultural Festival 2025', '2025-07-15 18:00:00+05:45', 'Experience the rich traditions of Nepal with live performances and food stalls.', 200, 150, 150000, '/images/uploads/cultural_festival.jpg', true),
  ('Mountain Music Concert', '2025-08-10 19:00:00+05:45', 'Enjoy live music under the stars with top Nepali artists.', 300, 200, 200000, '/images/uploads/music_concert.jpg', true),
  ('Art & Craft Exhibition', '2025-09-05 14:00:00+05:45', 'Discover local artisans and their unique creations.', 150, 100, 100000, '/images/uploads/art_exhibition.jpg', false);

INSERT INTO bookings (booking_id, event_id, full_name, phone_number, email_address, ticket_quantity, signature, consumed) VALUES
  ('EVENTNP_01', 1, 'John Doe', '+9771234567890', 'john@example.com', 2, '', false),
  ('EVENTNP_02', 2, 'Jane Smith', '+9770987654321', 'jane@example.com', 3, '', false),
  ('EVENTNP_03', 3, 'Alice Brown', '+9771122334455', 'alice@example.com', 1, '', false);
