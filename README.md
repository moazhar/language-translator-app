# language-translator-app
A RESTful service that translates a text from one language to another and responds back.

### Technology Used:
- Javascript
- Node.JS
- Express
- Redis
- Google Cloud Service

### DESIGN DECISION
- It is a RESTFull service which uses REST API standars to serve incoming requests.
- **Redis** has been used as Caching system as it is **in-memory database** and is really fast for retrieving data
- Google Translator API is used for language translation.
- **Mocha** is used as testing framework and **Chai** as Assertion library
- **Swagger** is used for API documentation

### Redis Database Schema
- As redis stores the data as key value pair below is the format in which the data gets stored
- **"key":"value"** 
- **key** --> input text
- **value** --> Array of translated languages
- example: "Hello World": ["kn:ಹಲೋ ಪ್ರಪಂಚ", "hi:नमस्ते दुनिया"]
- For smart caching the specified text is translated into other languages as well and stores in db

### SETUP & RUN:
- Installation required: Node.JS, Redis, GIT
- Download Node.JS, git and Redis database in you're local machine
- Start redis server by executing the **redis-server.exe** and **redis-cli.exe** files on the command prompt (Windows)
- Pull the code from gitHub repository
- Open the code in any of your favourite editor.
- Execute the command **npm install** which will download all the required packages to run the project from NPM.
- Create a **.env** file and add the Google Cloud Service credentials and Port details
- Start the Node.JS server by running the command **npm start** on the terminal
- Server is ready to recieve the requests at provided port

### Testing
- To test all possible test cases mentioned in the file **test->translate-route.test.js** run the below command **npm run test** on the terminal
  
### API Documentation
- Start the Node.JS server by running the command **npm start** on the terminal
- Open any browser and enter URL **http://localhost:3009/api-docs**
- You will be redirected to API documentation page

### Improvement
- Smart caching can be enhanced by storing only regional/country specific languages rather than storing all the available languages.
- Performance of the application can be improved by introducing load balancing using inbuilt Node module **Cluster.js**
