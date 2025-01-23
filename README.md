# QuoteHub Website - Postgres

A dynamic platform for book enthusiasts to share, rate, and discuss their favorite reads and quotes. Users can add book details, provide reviews, retrieve book covers via the OpenLibrary API, and organize notes effortlessly. Powered by Node.js, Express, PostgreSQL, and Axios.

---

## **Deployed Application**

Access the live site here: [QuoteHub Website](https://quotehub-website-postgres.onrender.com)

*Note: It may take up to 60 seconds to load as the app is hosted on Render's free tier.*

---

## **Features**

- **Book Sharing & Quotes**: Share book details like author, title, date read, rating, and opinion, and manage notes or memorable quotes for each book.
- **Dynamic Book Covers**: Fetch book covers via OpenLibrary API using ISBN.
- **Sorting Options**: View books sorted by title, date read, or ratings.
- **CRUD Functionality**: Add, edit, delete, and update book details and notes seamlessly, with PostgreSQL database manipulation.

---

## **Tech Stack**

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: EJS templates, HTML, CSS, JavaScript, jQuery
- **Middlewares**: Body-parser
- **API Integration**: OpenLibrary API for book covers
- **Deployment**: Render

---

## **Installation**

### **Prerequisites**

- Node.js (v16 or later)
- PostgreSQL database

### **Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quotehub-website-postgres.git
   ```
2. Navigate to the project directory:
   ```bash
   cd quotehub-website-postgres
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your PostgreSQL database and update the database credentials in the code:
   ```javascript
   const pool = new pg.Pool({
     user: 'YOUR_DB_USER',
     host: 'YOUR_DB_HOST',
     database: 'YOUR_DB_NAME',
     password: 'YOUR_DB_PASSWORD',
     port: YOUR_DB_PORT,
   });
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Visit `http://localhost:3000` in your browser.

---

## **Database Schema**

### **Tables**

- **Books**: Stores book details (name, author, date read, rating, opinion, and Amazon link).
- **Identifiers**: Contains key-value pairs for fetching book covers.
- **Notes**: Stores user-added quotes or memorable excerpts.

---

## **API Integration**

This app uses the OpenLibrary API to dynamically fetch book covers based on ISBN. Covers are displayed using the URL format:

```
https://covers.openlibrary.org/b/{key}/{value}-{size}.jpg
```

Where:

- `key` is the identifier key (e.g., ISBN).
- `value` is the identifier value.
- `size` is the desired image size (e.g., "L" for large).

---

## **License**

This project is licensed under the MIT License. See the LICENSE file for details.

