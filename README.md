# `f1-champions` An interactive listing of Formula1 World Champions

This project is an AngularJS application that lists the Formula1 World Champions
for each year (currently from 2005 to 2015) and also displays the winners
of each round during that specific year.

The season and race data is sourced from the Experimental Motor Racing Developer API [http://ergast.com/mrd].

The circuit and driver images are sourced from the Wikipedia API [https://en.wikipedia.org/w/api.php].

The country codes and country flags are sourced from [https://restcountries.eu] and [http://www.countryflags.io].


## Getting Started

To view the app go to [http://f1champions.tarr.co.za]

To view the source files, or to create a fork, clone the `f1-champions` repository and install the dependencies:


### Prerequisites

You need git to clone the `f1-championsd` repository. You can get git from [https://github.com/Starrzan/f1-champions.git].

THere are a number of Node.js tools that is used to build the application. You must have Node.js
and its package manager (npm) installed. You can get them from [https://nodejs.org].


### Clone `f1-champions`

Clone the `f1-champions` repository using git:

```
git clone https://github.com/Starrzan/f1-champions.git
cd f1-champions
```


### Install Dependencies

There are two kinds of dependencies in this project: tools and AngularJS framework code. The tools are used
to manage the application.

* The tools via `npm`, the [Node package manager][npm].
* The AngularJS code via `bower`, a [client-side code package manager][bower].

There is a preconfigured `npm` to automatically run `bower`:

```
npm install
```

Behind the scenes this will also call `bower install`. After that, you should find out that you have
two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the Angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
`f1-champions` changes this location through the `.bowerrc` file. Putting it in the `app` folder
makes it easier to serve the files by a web server.*


### Run the Application

The app is preconfigured with a simple development web server:

```
npm start or gulp run
```

Now browse to the app at [`localhost:8000`].


## Contact

For more updates on the development of this application please follow [http://twitter.com/sir_starr].