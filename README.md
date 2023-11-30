# Food Bank Application

# What Does It Do?

### `Problem`
Manually filling out food bank applications, creating food bank attendance lists, and tallying up the number of people that have attended a food bank, is both tedious and time consuming.  

<br/>

### `Solution`
With this food application the user can:

- Fill out a food bank application.
- Instantly find out if the applicant qualifies.
- Create, update and delete food bank lists, and applicants.
- Have access to a dynamic attendance sheet, that you can add and remove from on the day of the event.
- Have access to all of the statistics needed for the food bank organization.
 
<br/>
<br/>

# Features

### `Login Page`
For demo purposes the username is "Demo" and the password is "demo123".

<br/>

### `Dashboard Page`
The dashboard page supplies the user with all of the statistics from the most recently created foodbank attendance list.

<br/>

### `New Applicant Page`
Supplies a very simple looking form for the user to fill out.  Upon completing the form the user is notified if the applicant qualifies or not.

<br/>

### `Search Page`
Provides the user the ability to look up an applicant's information and the ability to print the official foodbank form, with the data pre-filled.

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