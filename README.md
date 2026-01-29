# Deriverse Trading Dashboard 📊

An advanced trading analysis dashboard designed to give traders deep insights into their performance history. Built with React, TypeScript, and Tailwind CSS.

## ✨ Core Features

- **Advanced Analytics:**
  - **Time-based Analysis:** Break down performance by hour, day of the week, and trading session.
  - **Order Type Analysis:** Compare the effectiveness of Market vs. Limit orders with detailed win rates and average PnL.
- **Comprehensive Trade Management:**
  - **Dynamic Filtering:** Instantly filter trades by symbol or a custom date range.
  - **Detailed Trade History:** A rich table view with all essential data points.
  - **Note Annotation:** Add, edit, and save persistent notes for any trade.
- **Modern & Responsive UI:**
  - **Custom Symbol Dropdown:** A sleek, custom-built dropdown with correctly rendered logos for all trading pairs.
  - **Data Export:** Export filtered trade data to **CSV** or **Excel**.
  - **Dark/Light Mode:** A beautiful and consistent theme toggle.

## 🛠️ Tech Stack

| Category          | Technology      |
| ----------------- | --------------- |
| **Frontend**      | React, Vite     |
| **Language**      | TypeScript      |
| **Styling**       | Tailwind CSS    |
| **State Mgmt**    | Zustand         |
| **Charting**      | Recharts        |
| **Data Handling** | PapaParse, XLSX |
| **Icons**         | React Icons     |

## ℹ️ Note on Data Source

Currently, the dashboard is populated with static mock data from `src/data/mockTrades.ts` for demonstration purposes. The architecture is designed to be easily adaptable to a live API.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NoMad-bnb/deriverse-trading-dashboard.git
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd deriverse-trading-dashboard
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## 📄 License

This project is licensed under the MIT License.