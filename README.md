# Nursing Home Prescription Management and PillBox Sorting System

## Project Overview

This project was developed as part of my bachelor thesis. Its purpose is to digitize and automate the prescription management process in nursing homes and to support the operation of a PillBox Sorting Robot.

The system helps nursing home administrators manage important prescription details, such as:

- patient information;
- doctor information;
- prescribed medication;
- prescription duration;
- renewal dates;

The project is composed of three main parts:

1. **Frontend application** — a Vue.js web application used by administrators and pharmacists to manage patients and prescriptions.
2. **Backend application** — a Node.js and Express server that handles business logic, database operations, and communication with external devices.
3. **Arduino program** — the program that controls the stepper motors and sensors of the PillBox Sorting Robot.

The frontend and backend are developed as two separate projects. The backend also communicates with a PostgreSQL database and with the Arduino board used by the robot prototype.

---

## Technologies Used

### Frontend

- Vue.js 3
- Vite
- Vue Router
- Vuex
- Socket.IO Client
- Font Awesome
- ESLint
- Prettier
- Vitest

### Backend

- Node.js
- Express
- PostgreSQL
- node-postgres (`pg`)
- SerialPort
- Pug
- Morgan
- CORS
- Body Parser

### Database

- PostgreSQL

### Hardware / Robot Control

- Arduino board
- Stepper motors
- Infrared sensor
- Serial communication between the backend and the Arduino board

### Recommended IDEs

- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Arduino IDE](https://www.arduino.cc/en/software)

---

## Required Package Versions

The project uses the package versions listed below. These versions are defined in the corresponding `package.json` files and should be installed by running `npm install` inside each project folder.

> Important: run `npm install` separately for the frontend project and the backend project.

---

## Frontend

The frontend is a Vue.js application used by nursing home administrators to manage patients, prescriptions, renewal information, and medication-related data.
In addition, it is used by the pharmacists of the nursing home to verify the prescriptions-related data and for commanding
the Pillbox Sorting Robot.

It provides the user interface of the system and sends requests to the backend whenever data needs to be created, read, updated, or deleted.

### Frontend Project Setup

Before running the frontend, make sure that Node.js and npm are installed on your computer.

Then, open the frontend project in WebStorm and run the following command in the IDE terminal:

```bash
npm install
```

This command installs all frontend dependencies defined in `package.json`.

To start the frontend application, run:

```bash
npm run dev
```

The application can also be started from the WebStorm **Run** button after configuring an npm run configuration.

### Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server using Vite. |
| `npm run build` | Builds the frontend application for production. |
| `npm run preview` | Previews the production build locally. |
| `npm run test:unit` | Runs unit tests with Vitest. |
| `npm run lint` | Runs ESLint and automatically fixes issues where possible. |
| `npm run format` | Formats the source files using Prettier. |

### Frontend Dependencies

| Package | Version |
|---|---:|
| `@fortawesome/fontawesome-svg-core` | `^7.0.0` |
| `@fortawesome/free-brands-svg-icons` | `^7.0.0` |
| `@fortawesome/free-regular-svg-icons` | `^7.0.0` |
| `@fortawesome/free-solid-svg-icons` | `^7.0.0` |
| `@fortawesome/vue-fontawesome` | `^3.1.1` |
| `@obewds/icon-svg-to-vue` | `^0.2.4` |
| `font-awesome-animation` | `^1.1.1` |
| `mitt` | `^3.0.1` |
| `serialport` | `^13.0.0` |
| `socket.io-client` | `^4.8.3` |
| `vue` | `^3.5.17` |
| `vue-router` | `^4.5.1` |
| `vuex` | `^4.1.0` |

### Frontend Development Dependencies

| Package | Version |
|---|---:|
| `@eslint/js` | `^9.29.0` |
| `@vitejs/plugin-vue` | `^6.0.0` |
| `@vitest/eslint-plugin` | `^1.2.7` |
| `@vue/eslint-config-prettier` | `^10.2.0` |
| `@vue/test-utils` | `^2.4.6` |
| `eslint` | `^9.29.0` |
| `eslint-plugin-vue` | `~10.2.0` |
| `globals` | `^16.2.0` |
| `jsdom` | `^26.1.0` |
| `prettier` | `3.5.3` |
| `vite` | `^7.0.0` |
| `vite-plugin-vue-devtools` | `^7.7.7` |
| `vitest` | `^3.2.4` |

---

## Backend

The backend receives requests from the frontend, performs the required CRUD operations, communicates with the PostgreSQL database, and sends the results back to the frontend.

It also acts as a communication layer between the web application and external devices, such as the Arduino board used by the PillBox Sorting Robot.

Communication with the Arduino board is handled using the `SerialPort` module. This module creates a duplex communication channel between the backend and the Arduino board, allowing both sides to send and receive messages. After the robot operation is completed, the backend returns the result to the frontend.

The backend also calculates dynamic prescription properties, such as the prescription status and renewal date. These calculations are handled on the server side to keep the frontend simpler and improve efficiency.

### Backend Project Setup

Before running the backend, make sure that the following tools are installed:

- Node.js;
- npm;
- PostgreSQL.

After downloading the backend project, open it in WebStorm and run the following command in the IDE terminal:

```bash
npm install
```

This command installs all backend dependencies defined in `package.json`.

To start the backend application, run:

```bash
npm start
```

or:

```bash
node ./bin/www
```

The backend can also be started from the WebStorm **Run** button after configuring a Node.js run configuration.

### Backend Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the backend server using `node ./bin/www`. |

### Backend Dependencies

| Package | Version |
|---|---:|
| `body-parser` | `^2.2.0` |
| `cookie-parser` | `~1.4.4` |
| `cors` | `^2.8.5` |
| `debug` | `~2.6.9` |
| `express` | `^5.0.0` |
| `http-errors` | `~1.6.3` |
| `morgan` | `~1.9.1` |
| `pg` | `^8.18.0` |
| `pug` | `3.0.3` |
| `read-excel-file` | `^8.0.3` |
| `serialport` | `^13.0.0` |

---

### Database

The application uses **PostgreSQL** as its database system. The backend connects to the database through the **node-postgres** package, also known as `pg`.

PostgreSQL stores the prescription information used by the web application, including patient details, doctor details, prescription duration, prescription dates, and the pill schedule for each prescription.

### Database Setup

Before running the backend, make sure that:

- PostgreSQL is installed on your machine.
- PostgreSQL is running.
- A database has been created for this project.
- The backend database connection configuration matches your local PostgreSQL credentials.

A typical local PostgreSQL configuration can look like this:

| Field | Example Value |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | your PostgreSQL password |
| Database | `patients_database` |

You may use another database name, username, or password, but the backend configuration must use the same values.

### Creating the Database Tables from WebStorm

The easiest way to create the required tables is directly from **WebStorm IDE**, using its built-in database tools.

#### Step 1: Open the Database Tool Window

In WebStorm, open the database panel from:

```text
View -> Tool Windows -> Database
```

#### Step 2: Add a PostgreSQL Data Source

Click the **+** button in the Database panel and select:

```text
Data Source -> PostgreSQL
```

If WebStorm asks to download the PostgreSQL driver, click **Download**.

#### Step 3: Configure the PostgreSQL Connection

Fill in the connection details according to your local PostgreSQL setup.

Example configuration:

```text
Host: localhost
Port: 5432
User: postgres
Password: your_postgres_password
Database: patients_database
```

After completing the fields, click **Test Connection**.

If the connection is successful, click **Apply** and then **OK** to save the data source.

#### Step 4: Open an SQL Console

Right-click on the connected database and select:

```text
New -> Query Console
```

This opens an SQL editor where you can execute SQL commands directly on the selected database.

#### Step 5: Create the Tables

Copy and run the following SQL script inside the WebStorm SQL console:

```sql
CREATE TABLE prescriptions
(
    id                    varchar NOT NULL
        PRIMARY KEY,
    duration              varchar NOT NULL,
    prescription_dates    varchar NOT NULL,
    patient_name          varchar NOT NULL,
    doctor_name           varchar NOT NULL,
    doctor_specialization varchar NOT NULL
);

CREATE TABLE prescription_pills
(
    id         varchar NOT NULL
        PRIMARY KEY,
    morning    varchar NOT NULL,
    lunch      varchar NOT NULL,
    dinner     varchar NOT NULL,
    before_bed varchar NOT NULL
);
```

To execute the script, click the green **Run** button or press:

```text
Ctrl + Enter
```

On macOS, depending on the WebStorm keymap, you may need to use:

```text
Cmd + Enter
```

#### Step 6: Check That the Tables Were Created

After running the script, refresh the database schema from the Database panel.

You should now see the following tables:

```text
prescriptions
prescription_pills
```

The tables should usually appear under the `public` schema:

```text
patients_database
`-- schemas
    `-- public
        `-- tables
            |-- prescriptions
            `-- prescription_pills
```

These tables are now ready to be used by the backend application.

### Notes

- If the tables already exist, WebStorm may show an error when running the `CREATE TABLE` script again. In that case, you do not need to recreate them.
- If you want to safely run the script multiple times, you can replace `CREATE TABLE` with `CREATE TABLE IF NOT EXISTS`.
- The backend database connection must point to the same PostgreSQL database that you configured in WebStorm.
- If the backend uses environment variables, make sure they match your local database configuration.

Example environment configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patients_database
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

---

## Arduino Program

The Arduino program controls the stepper motors and sensors that are part of the PillBox Sorting Robot.

The easiest way to upload the program to the Arduino board is by using the **Arduino IDE**. Open the Arduino project, connect the board, select the correct board and port, and press the **Upload** button. The IDE will compile the code and upload it to the board.

> Note: The part of the web application that controls the PillBox Sorting Robot requires a physical connection to the robot prototype. Since only one prototype exists, this functionality is not accessible without the hardware setup.

---

## Running the Complete System

To run the complete system locally:

1. Start PostgreSQL and make sure the application database exists.
2. Open the backend project in WebStorm.
3. Install backend dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
npm start
```

5. Open the frontend project in WebStorm.
6. Install frontend dependencies:

```bash
npm install
```

7. Start the frontend development server:

```bash
npm run dev
```

8. Open the URL displayed by Vite in the browser.

---

## Recommended IDE Setup

For the best development experience, the following tools are recommended:

- [WebStorm](https://www.jetbrains.com/webstorm/) — for frontend, backend, and PostgreSQL integration.
- [Arduino IDE](https://www.arduino.cc/en/software) — for compiling and uploading the Arduino program to the board.
- [PostgreSQL](https://www.postgresql.org/download/) — for storing application data.
