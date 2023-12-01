# Attendance Application

# What Does It Do?

### `Problem`
Using printed out spreadsheets to take attendance.  This was initially designed for more church to provide an easier way to take attendance, and gather data on the people that are showing up (such as age, and membership status). 

<br/>

### `Solution`
With this attendance application the user can:

- Create a new attendance sheet.
    - This is done by first creating a group.
    - If you want to use a group that already exists that's also an option.
    - A title is automatically assigned to the attendance, using today's date.
    - If the user would like to use a different title for the attendance sheet, they're able to do that by altering the input field.
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

### `Foodbank List Dashboard`
Gives the user three different options.

    -Create Foodbank List
    -Search Foodbank Lists
    -Current Foodbank List

<br/>

### `Create Foodbank List Page`
Gives the user the ability to create a new list and add applicants to the list.  This page automatically saves, so there is no need to worry about saving.

<br/>

### `Search Foodbank Lists Page`
The user is provided the chance to search past lists and delete them if they so desire.

<br/>

### `Current Foodbank List Page`
This is a dynamic attendance sheet that is to be used on the day of the foodbank, or if you ever need to add applicants to the current list.

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

    cd my-app

<br/>

### `Development Mode` 
The development mode will run on [http://localhost:3000](http://localhost:3000).  Development mode can be started by running the command.  (Keep in mind, none of the app will run completely in development mode, as most of it relies on being connected to the server).

    npm run start

(Keep in mind, app won't run completely in development mode, as most of it relies on being connected to the server).

<br/>

### `Production Mode`
The server will run on [localhost:4000](localhost:4000).  The entire application can be ran locally by entering the following commands.

    npm run build
    npm run server
<br/>
<br/>

# Dependencies

- React
- React Router
- Node
- Express
- Mysql

<br/>
<br/>

#  Summary
This application was created largely for my wife.  She is in charge of running the logistics of the food bank at our church, and I thought it was crazy that she was still doing everything with pen and paper.  I built this app to streamline the foodbank application process, and simplify this aspect of her life.  I hope that others can benefit from it as well.

If you would like to have any fetures added or if you would like to make any, just shoot me a message or a pull request.  Thanks for checking out my food bank app.