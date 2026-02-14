# Prescriptions server

Alias the **backend**, it receives requests from the Prescriptions Frontend and performs the requested **CRUD operations** on the database and sends back the results.

The interesting part about the backend is how it **communicates**, as a server, with other
devices (e.g. Arduino Board, Database Server), after it received the request from the frontend.

The communication with the Arduino Board is realized via the **"SerialPort" module** that handles
the connection and creates a duplex communication channel, or pipe, in which the backend and the board
send each other messages. After the communication is over, the backend will send back the results to the frontend.

For the communication with the database, **"node-postgres" module** was employed.
It provides a straight-forward interface for connecting to the database and creating queries.

In addition, the backend calculates some dynamic prescription properties, like the status and the renewal date, instead of the frontend, for efficency purposes.

The frontend project can be found [here](https://github.com/MarcoRO04/patients-care-app).

## Recommended IDE Setup
[Webstorm](https://www.jetbrains.com/webstorm/download/?section=windows)

## Project Setup

Firstly, make sure you have installed [Node.js](https://nodejs.org/en/download) and [Postgres](https://www.postgresql.org/download/).

Afterwards, install all the project's packages with:

```sh
npm install
```

To run the application, the simplest way is to type the command below in the IDE's terminal:

```sh
node ./bin/www
```

or it can be started from the IDE **RUN button** too.
