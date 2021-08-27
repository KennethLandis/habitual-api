Habitually Successful API

Created Habit tracking app with custom server

Summary: Custom API hosted on Heroku to connect to Habitually Successful app frontend.  Created endpoints to store users and passwords as well as track habits that are added or deleted and days completed for each habit to help users develop good habits for a better lifstyle.  

Screenshot: ![image](https://user-images.githubusercontent.com/67128061/129077645-9c0410d0-999a-4172-a5e7-788d83ae331d.png)

Live link: https://habitual-app-9a0jvj6na-kennethlandis.vercel.app/

Server Link: https://immense-fortress-04687.herokuapp.com

Technology: This app was built using React Html Css Javascript jQuery Express Node.js PSQL

App github: https://github.com/KennethLandis/habitual-app

Documentation

Routes and Endpoints

The habitual-api was written with a clients and a habits router built in with endpoints up date the two tables.
The "base url" + /clients route will allow you to GET a list of users or target a single by ID as well as POST a new user.
Each client posted will need to be serialized to prevent malicious scripting.

GET all users

"base url/clients"

GET user by ID

"base url/clients/{ID param}"

POST user

"base url/clients" including a req body with a client_name="" and user_password="".

We also include a route for manipulating the habits for each user to personalize their experience with the app.

These include a GET | POST | PUT | DELETE option targeting the habit by client id in the relational database. Each habit needs to be serialized to protect against malicious scripting.
