# Vaxxy App
This is the backend of the Vaxxy App. Instructions for running the whole app can be found in the main [repository](https://github.com/NinaWeiler/Solita-Vaccination-Excercise).
A working live version can be found at:
``` 
[https://vaxxy.herokuapp.com/](https://vaxxy.herokuapp.com/)
```
## Project Description
[Programming exercise](https://github.com/solita/vaccine-exercise-2021) for applying to the [Solita Dev Academy 2021](https://www.solita.fi/positions/akatemiasta-nostetta-devaajan-uralle-4447301003/).

The aim of the project was to create a web application for presenting some interesting data about the vaccinations. 

## Technologies
* React
* Nodejs
* Express
* Redux
* MongoDB
* NPM 
* Bulma.io
* Material UI
* Jest

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Backendend setup

* Clone the project repository
* Install the dependencies in the backend with npm. 
```
# Clone this repository
C:/> git clone https://github.com/NinaWeiler/Solita-Vaccination-Excercise.git

# Go to the backend folder
C:/> Solita-Vaccination-Exercise/backend

# Install dependencies 
C:/> npm install
```

### Running the app
* Navigate to the backend folder and run project in development mode with the command:
```
C:/> Solita-Vaccination-Exercise/backend
C:/> npm run dev
```

If you are also running the [frontend](https://github.com/NinaWeiler/Solita-Vaccination-Excercise), you can open [http://localhost:5000](http://localhost:5000) to view the app in the browser.

The backend runs on port 5000 and you can view api endpoints in the browser by navigatig to for example: 
```
localhost:5000/api/orders
```

### Running tests:
The app has tests for the backend. You can all run the tests in the backend directory with the command:
```
C:/> Solita-Vaccination-Exercise/backend
C:/> npm test
```
To run an individual test or set of tests run:
```
C:/> Solita-Vaccination-Exercise/backend
C:/> npm test -- -t 'name of test'
```

## Author
Nina Weiler