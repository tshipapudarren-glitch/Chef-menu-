# Chef's Menu Manager

Chef's Menu Manager is a React Native application built with Expo for creating and maintaining a restaurant menu on Android and iOS.

## Features

- Add dishes with a name, description, course, and price.
- Edit and delete menu items with immediate updates.
- Search dish names and descriptions, filter by Starter, Main Course, or Dessert, and reset the filters.
- View menu totals, average price, and item counts by course.
- Validate required text fields and prices, with clear empty states and action feedback.
- Use the menu workspace in a native mobile interface.

The app starts with sample menu items so the list, course balance, and statistics are visible immediately. Deleting all items shows the first-dish prompt.

## Run the Expo app

Requirements: Node.js, npm, and Expo Go on a supported Android or iOS device (or a configured native simulator).

```sh
npm install
npm start
```

Scan the QR code with Expo Go, or use the Expo terminal shortcuts to open a simulator. Type-check the TypeScript app with:

```sh
npm run typecheck
```

To run the Expo app in a desktop browser, install the project dependencies and run:

```sh
npm run web
```

## Project structure

- `App.tsx` contains the native menu workspace, statistics, filtering, item actions, and dish form.
- `index.ts` registers the root component with Expo.
- `app.json` contains the Expo app configuration.
- `src/types.ts` defines the menu item and course types.
- `app/` contains the existing standalone Android application module.

## Changelog

### Final PoE

- Converted the root application to React Native with Expo.
- Built the menu list with native `FlatList`, `TextInput`, and selection controls.
- Added menu item creation, editing, deletion, validation, filtering, and statistics in the native app.
- Added a native dish form with course selection, input validation, and clear error/success feedback.
- Added a first-dish empty state and accessible control labels.

### Part 2

- Created the menu workspace with a clear title and readable, mobile-first layout.
- Added the dish name, description, course, and price form fields.
- Added a live menu list, sample dishes, and initial feedback when a menu has no items.Here is a complete, professionally formatted `README.md` template tailored specifically for your **Chef's Menu Manager** application (Part 2 deliverable).

You can copy and paste this directly into the `README.md` file in the root of your GitHub repository.

---

# Chef's Menu Manager — Part 2

A React Native mobile application developed with Expo that allows chefs to easily manage menu offerings by adding, validating, and viewing dishes in real-time.

---

## 📌 Project Overview

This repository contains **Part 2** of the **Chef's Menu Manager** mobile application project. The application serves as an interactive menu log where a chef can enter details for dishes across various courses (Starter, Main Course, Dessert) and view them instantly in a clean, scrollable menu layout.

---

## ✨ Features

* **Application Header:** Clear title and intuitive layout designed using core React Native components.


* **Menu Data Capture:** Dedicated form controls to capture essential dish information:


* **Dish Name** (Text Input)


* **Description** (Text Input)


* **Course** (Starter, Main Course, Dessert)


* **Price** (Numeric Input)




* **Input Validation & Feedback:**
* Checks that all required fields are filled before submitting.


* Validates price input to ensure a positive numeric value.


* Displays user-friendly error messages when validation fails.


* Provides a success confirmation message upon successfully adding a dish.




* **Dynamic Menu Display:**
* Displays an **empty state message** when no menu items exist.


* Automatically updates the displayed menu list in real-time as new dishes are added.


* Displays each dish inside a formatted card highlighting the dish title, course badge, price, and description with consistent alignment and spacing.





---

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
* **Language:** JavaScript / TypeScript
* **UI Components:** `TextInput`, `TouchableOpacity`, `FlatList`, `ScrollView`, `KeyboardAvoidingView`

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### **1. Prerequisites**

* [Node.js](https://nodejs.org/) installed on your machine.
* [Expo Go app](https://expo.dev/go) installed on your mobile device, or an iOS/Android simulator configured.

### **2. Installation**

1. Clone the repository:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/chefs-menu-manager.git

```


2. Navigate into the project directory:
```bash
cd chefs-menu-manager

```


3. Install dependencies:
```bash
npm install

```



### **3. Running the App**

Start the Expo development server:

```bash
npx expo start

```

* Scan the QR code using the **Expo Go app** on your Android or iOS device.
* Alternatively, press `a` to launch the Android emulator or `i` to launch the iOS simulator.

---

## 📹 Video Demonstration

A short video walkthrough demonstrating the application UI, input validation, and adding multiple menu items is available on YouTube:

* **YouTube Video Link:**https://youtu.be/b7TvaWhDCyE



---

## 🧑‍💻 Author

* **Developer:** Mbofholowo Shaun Tshipapu
* **Institution:** Emeris Sandton Campus
