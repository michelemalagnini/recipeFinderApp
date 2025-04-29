# 🍽️ Recipe Finder App

A modern web application built with Angular to search, explore, and save recipes from around the world.  
This project was developed as part of a **Frontend Technical Assessment**.

---

## 🚀 Features

- 🔍 Search for recipes by name or ingredient
- 🖼 View search results with name and image
- 📋 Detailed recipe page with:
  - Ingredients list
  - Cooking instructions
  - YouTube tutorial link (if available)
- ❤️ Add or remove favorite recipes (persisted in LocalStorage)
- ⭐ Dedicated page to view and manage favorites
- 💡 Responsive and user-friendly interface
- ⚡ Built with Angular Standalone APIs and Signals (Angular 19+)

---

## 🛠️ Tech Stack

| Technology        | Description                                 |
|-------------------|---------------------------------------------|
| Angular Standalone | App built without NgModules                |
| Signals            | Reactive state management for favorites    |
| LocalStorage       | Lightweight persistence for favorite recipes |
| Bootstrap 5        | Responsive grid and layout system          |
| RxJS               | Reactive HTTP calls                        |
| TheMealDB API      | Public API for recipes                     |

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/recipe-finder.git
cd recipe-finder
### 2. System Requirements

Ensure you have the following installed:
- Node.js 
- Angular CLI or use NPX before the angular cli command

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application Locally

```bash
ng serve --open
```

The first time, this command builds the application and opens your browser at http://localhost:4200.

## 🌐 Live Demo

The application has been deployed and is available for public viewing. Check it out at:
(https://recipe-finder-app-liart.vercel.app)
