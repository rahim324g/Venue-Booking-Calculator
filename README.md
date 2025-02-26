# Venue-Bookin<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legae Garden Home - Venue Booking</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }

        h1, h2, h3 {
            color: #2d2d2d;
            margin-bottom: 20px;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        /* Hero Section */
        .hero {
            background-image: url('https://source.unsplash.com/1600x900/?garden'); /* Replace with your image */
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            position: relative;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5); /* Dark overlay */
        }

        .hero-content {
            position: relative;
            z-index: 1;
        }

        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .hero p {
            font-size: 20px;
            margin-bottom: 30px;
        }

        .hero .btn {
            padding: 15px 30px;
            font-size: 18px;
            background-color: #28a745;
            color: white;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }

        .hero .btn:hover {
            background-color: #218838;
        }

        /* Features Section */
        .features {
            padding: 60px 20px;
            text-align: center;
            background-color: #f9f9f9;
        }

        .features h2 {
            font-size: 36px;
            margin-bottom: 40px;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .feature-item {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .feature-item h3 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .feature-item p {
            font-size: 16px;
            color: #666;
        }

        /* Booking Calculator Section */
        .booking-calculator {
            padding: 60px 20px;
            text-align: center;
            background-color: white;
        }

        .booking-calculator h2 {
            font-size: 36px;
            margin-bottom: 40px;
        }

        .calculator-container {
            max-width: 500px;
            margin: 0 auto;
            background: #f9f9f9;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .calculator-container label {
            font-size: 16px;
            color: #555;
            margin-bottom: 10px;
            display: block;
            text-align: left;
        }

        .calculator-container input, .calculator-container select {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
        }

        .calculator-container button {
            padding: 15px 30px;
            font-size: 18px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .calculator-container button:hover {
            background-color: #0056b3;
        }

        .calculator-container h3 {
            font-size: 24px;
            margin-top: 20px;
        }

        /* Gallery Section */
        .gallery {
            padding: 60px 20px;
            text-align: center;
        }

        .gallery h2 {
            font-size: 36px;
            margin-bottom: 40px;
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .gallery img {
            width: 100%;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }

        .gallery img:hover {
            transform: scale(1.05);
        }

        /* Contact Section */
        .contact {
            padding: 60px 20px;
            text-align: center;
            background-color: #f9f9f9;
        }

        .contact h2 {
            font-size: 36px;
            margin-bottom: 40px;
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }

        .contact-form input, .contact-form textarea {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
        }

        .contact-form button {
            padding: 15px 30px;
            font-size: 18px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .contact-form button:hover {
            background-color: #0056b3;
        }

        /* Footer */
        .footer {
            background-color: #2d2d2d;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to Legae Garden Home</h1>
            <p>Your perfect getaway for relaxation and events.</p>
            <a href="#booking" class="btn">Book Now</a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <h2>Our Features</h2>
        <div class="feature-grid">
            <div class="feature-item">
                <h3>Luxurious Apartments</h3>
                <p>Spacious and fully equipped with modern amenities.</p>
            </div>
            <div class="feature-item">
                <h3>Beautiful Garden</h3>
                <p>Perfect for outdoor events and relaxation.</p>
            </div>
            <div class="feature-item">
                <h3>Affordable Pricing</h3>
                <p>Competitive rates for all types of bookings.</p>
            </div>
        </div>
    </section>

    <!-- Booking Calculator Section -->
    <section class="booking-calculator">
        <h2>Booking Calculator</h2>
        <div class="calculator-container">
            <label for="people">Number of People:</label>
            <input type="number" id="people" value="10" min="1" step="1" placeholder="Enter number of people">

            <label for="apartments">Select Number of Apartments:</label>
            <select id="apartments">
                <option value="0">No Apartment</option>
                <option value="1">1 Apartment</option>
                <option value="2">2 Apartments</option>
            </select>

            <label for="days">Number of Days:</label>
            <input type="number" id="days" value="1" min="1" step="1" placeholder="Enter number of days">

            <button onclick="calculatePrice()">Calculate Total</button>
            <h3>Total Price: <span id="totalPrice">BWP 0</span></h3>
        </div>
    </section>

    <!-- Gallery Section -->
    <section class="gallery">
        <h2>Gallery</h2>
        <div class="gallery-grid">
            <img src="https://source.unsplash.com/400x300/?garden" alt="Garden">
            <img src="https://source.unsplash.com/400x300/?apartment" alt="Apartment">
            <img src="https://source.unsplash.com/400x300/?event" alt="Event">
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact">
        <h2>Contact Us</h2>
        <form class="contact-form">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2023 Legae Garden Home. All rights reserved.</p>
    </footer>

    <!-- JavaScript for Booking Calculator -->
    <script>
        function calculatePrice() {
            const people = parseInt(document.getElementById('people').value);
            const apartments = parseInt(document.getElementById('apartments').value);
            const days = parseInt(document.getElementById('days').value);
            
            let basePricePerPerson = 100;
            let apartmentPrice = 0;
            let discount = 0;

            // Price for apartments
            if (apartments === 1) {
                apartmentPrice = 1000;
                discount = 400;
            } else if (apartments === 2) {
                apartmentPrice = 2000;
                discount = 800;
            }

            let totalPrice = (people * basePricePerPerson) + apartmentPrice - discount;
            totalPrice *= days;

            document.getElementById('totalPrice').innerText = "BWP " + totalPrice;
        }
    </script>

</body>
</html>g-Calculator
