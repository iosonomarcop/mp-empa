# Empatica Exercise
As requested, the exercise is composed of two parts: the home page and a secondary single page app.
To open the home page run first the command  
```
npm ci
```
to install the required dependencies. After that if you run the command
 
```
 npm run startServer
 ```

a tab of your default browser will be opened automatically, showing the site home page.

## Single page application
To access the single page application type the address

[http://localhost:3000/app](http://localhost:3000/app)


this will redirect you to the login page.  
You can login using any username and password. The session will last until the tab is closed.

### Source code structure

The app has been created using angular 8 with the following structure:
 * _home_: contains the home page (index.html)
 * _server_: contains the mock data for the app and the scripts to run the server
 * _src_: contains the typescript adn scss source code 
    * _src/ui_: contains the scss files for both the app and the home page
    * _src/app_: contains the source code of the app
 
 The application has been made using the angular cli, so the command "test" can be used to run all the test suite. 
 The application has been pre-compiled, but is possible to build it again in production mode using the command
 ```
  npm run buildProd
 ```
