<h1>Prescriptions server</h1>

<p style="font-size: 14px">
Alias the backend, it receives requests from the frontend and performs the requested CRUD operations on the database and sends back the results.
</p>

<p style="font-size: 14px">
The interesting part about the backend is how it communicates, as a server, with other
devices (e.g. Arduino Board, Database Server), after it received the request from the frontend.
</p>

<p style="font-size: 14px">
The communication with the Arduino Board is realized via the "SerialPort" module that handles
the connection and creates a duplex communication channel, or pipe, in which the backend and the board
send each other messages. After the communication is over, the backend will send back the results to the frontend.
</p>

<p style="font-size: 14px">
For the communication with the database, "node-postgres" module was employed.
It provides a straight-forward interface for connecting to the database and creating queries.

<h2>Recommended IDE Setup</h2>
Webstorm

<h2>Project Setup</h3>

<p style="font-size: 14px"> 
Firstly, make sure you have installed Node.js and Postgres.
</p>

<p style="font-size: 14px">
You can download them from their official websites:

https://nodejs.org/en/download

https://www.postgresql.org/download/
</p>

<p style="font-size: 14px">
Afterwards, in order to install the needed libraries, you will need the "npm" package manager. In terminal, in the IDE, please type.

npm install

Then please install the "node-postgres" and "SerialPort" modules with npm.

npm install pg

npm install serialport

To run the application, in terminal use:

node ./bin/www

or it can be started from the IDE run button too
</p>
