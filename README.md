# `f1-champions` An interactive listing of F1 World Champions

This project is an AngularJS application that lists the Formula 1 World Champions
for each year (currently from 2005 to 2015) and also displays the winners
of each round during that specific year.

The season and race data is sourced from the Experimental Motor Racing Developer API [http://ergast.com/mrd].


## Getting Started

To view the listings go to [http://f1champions.tarr.co.za]

To view the source files or to create a fork simply clone the `f1-champions` repository and install the dependencies:


### Prerequisites

You need git to clone the `f1-championsd` repository. You can get git from [here][git].

THere are a number of Node.js tools that is used to build the application. You must have Node.js
and its package manager (npm) installed. You can get them from [here][node].


### Clone `f1-champions`

Clone the `f1-champions` repository using git:

```
git clone https://github.com/Starrzan/f1-champions.git
cd f1-champions
```

If you just want to start a new project without the `f1-champions` commit history then you can do:

```
git clone --depth=1 https://github.com/Starrzan/f1-champions.git <your-project-name>
```

The `depth=1` tells git to only pull down one commit worth of historical data.


### Install Dependencies

There are two kinds of dependencies in this project: tools and Angular framework code. The tools help
us manage the application.

* The tools we depend upon via `npm`, the [Node package manager][npm].
* The Angular code via `bower`, a [client-side code package manager][bower].

There is a preconfigured `npm` to automatically run `bower` so we can simply do:

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

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start or gulp run
```

Now browse to the app at [`localhost:8000/index.html`].


## Contact

For more information on the development of this application please visit [http://chronicles.co.za].