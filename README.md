# **SmartShelf**

**SmartShelf** is a simple and intuitive browser-based pantry management tool that helps users efficiently track kitchen inventory, reduce waste, and plan shopping. Designed for home cooks, students, and small households, it allows users to add grocery items, monitor stock levels, and get alerts when items are running low or about to expire.

The app includes a built-in shopping list generator that compiles all low-stock or critical items. This list can be downloaded in **PNG format**, making it easy to share with family members via WhatsApp or print for grocery runs—no app install or login required.

Built entirely using **HTML, CSS, and JavaScript**, SmartShelf runs completely in the browser and stores data locally, ensuring privacy and fast performance without any backend setup.

---

## **Features**

* Add and manage pantry or kitchen items with quantity, unit, minimum stock limit, and expiry date
* Automatic status indicators: **Good**, **Expires Soon**, or **Use Immediately**
* Editable shopping list based on inventory needs
* Local search functionality for quick filtering
* Downloadable shopping list in **PNG format**
* Clean, responsive design with **light and dark mode toggle**
* Data persistence using browser **localStorage**

---

## **Technologies Used**

* **HTML5** – Markup structure
* **CSS3** – Styling and layout
* **JavaScript (Vanilla)** – Application logic and interactivity

---

## **Getting Started**

To run the project locally:

1. Clone or download this repository
2. Open the `index.html` file in any modern web browser
3. Start adding items to your kitchen inventory using the form interface

✅ No additional setup or dependencies required.

---

## **Use Case Example**

* Add an item like **"Milk"** with an expiry date two days from now
  → The system will automatically mark it as **"Expires Soon"**

* Add **"Rice"** with a quantity of 1 kg and a minimum limit of 2 kg
  → The system will indicate it as **"Use Immediately"**

* Use the shopping list tool to generate and download a PNG list of low-stock or expiring items.

---

## **File Structure**

```
SmartShelf/
├── index.html        # Main HTML file
├── style.css         # Application styling
├── script.js         # JavaScript logic
└── assets/
    └── icon.png      # Application icon (optional)
```

---

## **Potential Improvements**

* Integration with cloud storage (e.g., Firebase) for syncing across devices
* Mobile-first Progressive Web App (PWA) support
* Notifications for expiring items
* Barcode scanner integration for quick item addition

---

## **License**

This project is open-source and available under the **MIT License**.

