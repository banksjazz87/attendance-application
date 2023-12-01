# Attendance Application

# What Does It Do?

### `Problem`
Using printed out spreadsheets to take attendance.  Having a tedious process in keeping track of members and visitors. 

<br/>

### `Solution`
With this attendance application the user can:

- Create a new attendance sheet.
- Ability to create, update, delete, any attendant or attendance sheet.
- Have access to a dynamic attendance sheet, that you can add and remove from on the day of the event.
- Have access to all of the statistics gathered from the attendance, this is displayed with a bar graph.
 
<br/>
<br/>

# Features

### `Login Page`
For demo purposes the username is "Demo" and the password is "demo123".

<br/>

### `Dashboard`
The dashboard page supplies the user with all of the statistics from past attendance sheets.  Results can be viewed by selecting a group, followed by a year and month.  This will provide the user with a visual representation of the attendance sheet.

<br/>

### `New Attendance Page`
This gives the opportunity to use a group that already exists or create a new one.  An attendance title is automatically assigned to the attendance, using today's date, but this can be altered if so desired.

<br/>

### `Attendance Page`
Provides the user the ability to select the most recent attendance sheet for a particular group and take attendance with it.

<br/>

### `Search Page`
Gives the user the ability to view past attendance sheets.  This page is strictly read only.

<br/>

### `People Page`
Gives the user the ability to search through all of the attendants' information and edit, update, or delete it.  This page is layed out with pagination and a search bar to make searching for attendants quicker.


<br/>
<br/>

# Getting Started
<br/>

### `Node`
You will need to have node.js installed on your local system.  You can do this by following the directions listed [here](https://nodejs.org/en/).

<br/> 

### `Dependencies` 
Once Node is installed.  In the project directory , you will need to install all of the package.json dependencies, this can be done by running. 

    npm install

<br/>

### `Change Directory`
You will need to enter into the correct directory in your terminal.

    cd client

Open another terminal and cd into the root of the project.

    cd attendanceApplication

<br/>

### `Development Mode` 
The development mode will run on [http://localhost:3000](http://localhost:3000).  Development mode can be started by running the command.  (Keep in mind, the app will run completely in development mode, as most of it relies on being connected to the server).

    npm run start

(Keep in mind, app won't run completely in development mode, as most of it relies on being connected to the server).

<br/>

### `Production Mode`
The server will run on [localhost:3900](localhost:3900).  The entire application can be ran locally by entering the following commands.
    - In the client terminal run the command:

    npm run build

    -  In the root terminal run the commands:

    npm run build
    npm run start
<br/>
<br/>

# Dependencies

- React
- React Router
- Node
- Express
- DotEnv
- Cors
- Cookie Parser
- React Chart JS 2
- Font Awesome
- Recharts
- Typescript
- Mysql

<br/>
<br/>

#  Summary
This application was created largely for my church.  We needed to update and get away from using pen and paper for taking attendance.

If you would like to have any features added or if you would like to make any, just shoot me a message or a pull request.  Thanks for checking out my attendance app.