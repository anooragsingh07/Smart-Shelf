SmartShelf
SmartShelf is a lightweight, browser-based kitchen inventory management system designed to help users efficiently track pantry items and avoid food waste. Built with HTML, CSS, and JavaScript, it runs entirely in the browser and requires no backend or external integrations.

Features
Add and manage pantry or kitchen items with quantity, unit, minimum stock limit, and expiry date.

Automatic status indicators: Good, Expires Soon, or Use Immediately.

Editable shopping list based on inventory needs.

Local search functionality for quick filtering.

Downloadable shopping list in text format.

Clean, responsive design with light and dark mode toggle.

Data persistence using browser localStorage.

Technologies Used
HTML5 – Markup structure

CSS3 – Styling and layout

JavaScript (Vanilla) – Application logic and interactivity

Getting Started
To run the project locally:

Clone or download this repository.

Open the index.html file in any modern web browser.

Start adding items to your kitchen inventory using the form interface.

No additional setup or dependencies are required.

Use Case Example
Add an item like "Milk" with an expiry date two days from now.

The system will automatically mark it as "Expires Soon".

Add "Rice" with a quantity of 1 kg and a minimum limit of 2 kg.

The system will indicate it as "Use Immediately".

Use the shopping list tools to generate and download a list of low-stock or expiring items.

File Structure
bash
Copy
Edit
SmartShelf/
├── index.html        # Main HTML file
├── style.css         # Application styling
├── script.js         # JavaScript logic
└── assets/
    └── icon.png      # Application icon (optional)
Potential Improvements
Integration with cloud storage (e.g., Firebase) for syncing across devices.

Mobile-first progressive web app (PWA) support.

Notifications for expiring items.

Barcode scanner integration for adding items quickly.

License
This project is open-source and available under the MIT License.
