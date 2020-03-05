'use strict';

/**
 * Module dependencies.
 */

var config = require('../config'),
    express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoose = require('./mongoose'),
    mongoStore = require('connect-mongo')({
        session: session
    }),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    csp = require('helmet-csp'),
    flash = require('connect-flash'),
    hbs = require('express-hbs'),
    path = require('path'),
    _ = require('lodash'),
    vhost = require('vhost');
const convert = require("../../scripts/DataZ.js");


//BASE DE DATOS

var MongoClient = require('mongodb').MongoClient;
var mongourl = "";
/*if(process.env.PRODUCTION==true){
  mongourl = process.env.MONGODB_URI;

} else {
  mongourl = process.env.MONGODB_URI2;
}
console.log(mongourl)*/
var mongourl = "mongodb://localhost/meancore-dev";
//


/**
 * Configure the models
 */
var initServerModels = function() {
    mongoose.loadModels();
};

/**
 * Initialize local variables
 */
var initLocalVariables = function(app, config) {
    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    if (config.secure && config.secure.ssl) {
        app.locals.secure = config.secure.ssl;
    }
    app.locals.keywords = config.app.keywords;
    app.locals.livereload = config.livereload;
    app.locals.env = process.env.NODE_ENV;

    // Passing entire config to app locals
    app.locals.config = config;

    // if behind a proxy, such as nginx...
    if (config.proxy) {
        app.set('trust proxy', 'loopback');
    }

    // Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.host = req.protocol + '://' + req.get('host');
        res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
        next();
    });
};

/**
 * Configure Express session
 */
var initSession = function(app, config, db) {
    app.use(session({
        saveUninitialized: false, // dont save unmodified
        resave: false, // forces the session to be saved back to the store
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        name: config.sessionKey,
        store: new mongoStore({
            db: db,
            collection: config.sessionCollection,
            url: config.mongoDB.uri
        })
    }));
};

/**
 * Initialize application middleware
 */
var initMiddleware = function(app, config) {
    // Should be placed before express.static
    app.use(compress({
        level: 9,
        memLevel: 9
    }));

    // Enable logger (morgan) if enabled in the configuration file
    if (_.has(config, 'log.format')) {
        app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
    }

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '260mb'
    }));
    app.use(bodyParser.json({
        limit: '260mb'
    }));
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(flash());

    app.use(cookieParser());
};

/**
 * Configure handlebars Helpers
 */
var initHandlebars = function() {
    hbs.registerHelper('currency', function(number, options) {
        if (number === null || isNaN(number)) {
            return number;
        }
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    });

    hbs.registerHelper('decimal', function(number, options) {
        if (number === null || isNaN(number)) {
            return number;
        }
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }).substr(1);
    });

    hbs.registerHelper('ifeq', (a, b, options) => {
        return a == b ? options.fn(this) : options.inverse(this); // eslint-disable-line
    });

    hbs.registerHelper('ifnoteq', (a, b, options) => {
        return a != b ? options.fn(this) : options.inverse(this); // eslint-disable-line
    });

};

/**
 * Configure view engine
 */
var initViewEngine = function(app, config) {
    var serverViewPath = path.resolve(config.serverViewPath ? config.serverViewPath : './');
    app.set('views', [serverViewPath, config.staticFiles]);

    // server side html
    app.engine('server.view.html', hbs.express4({
        extname: '.server.view.html'
    }));
    app.set('view engine', 'server.view.html');

    //client side html
    app.engine('html', hbs.express4({
        extname: 'html'
    }));
    app.set('view engine', 'html');

    app.engine('js', hbs.express4({
        extname: '.js'
    }));
};

/**
 * Invoke server configuration
 */
var initServerConfiguration = function(app, config) {
    config.files.server.configs.forEach(function(configPath) {
        require(path.resolve(configPath))(app);
    });
};

/**
 * Configure Helmet headers configuration
 */
var initHelmetHeaders = function(app) {
    // Use helmet to secure Express headers
    var SIX_MONTHS = 15778476000;
    app.use(helmet.frameguard({
        action: 'sameorigin'
    }));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noCache());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubDomains: true,
        force: true
    }));

    // Disable cps during dev testing to prevent issues with ng-dev proxy
    if (process.env.NODE_ENV === 'production') {
        app.use(csp(config.cps));
    }

    // POST any CSP violations
    app.use('/report-violation', (req, res) => {
        if (req.body) {
            console.log('CSP Violation: ', req.body);
        } else {
            console.log('CSP Violation: No data received!');
        }
        res.status(204).end();
    });
};

/**
 * Configure the modules static routes
 */
var initClientRoutes = function(app, config) {
    var cacheTime = -9999;
    if (process.env.NODE_ENV !== 'development') {
        cacheTime = '30d';
    }

    // in development mode files are loaded from node_modules
    app.use('/node_modules', express.static(path.resolve(config.staticFiles + '../../node_modules/'), {
        maxAge: '30d', // Cache node modules in development as well as they are not updated that frequently.
        index: false,
    }));
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    function getDataZ() {
        return Promise.resolve('Hacer Cosas');
    }

    function convertDataZ(data) {
        var dataZ = convert.toDataZ(data);
        console.log("convirtiendo data");
    }

    function storeDataZ() {
        console.log("guardando la data en mongo");
    }

    // Setting the app router and static folder
    app.use('/', express.static(path.resolve(config.staticFiles), {
        maxAge: cacheTime,
        index: false,
    }));


    var mysql = require('mysql');
    var connectionMysql = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'zsoftwarenetsoft'
    });

    connectionMysql.connect(function(err) {
        if (err) throw err
        console.log("Conexión activa con MySql");
    });


    app.post('/DataZ/add', function(req, res) {
        console.log("Recibido Post DataZ:");
        console.log(req.body);
        try {
            var j = req.body; //Asignar variable a puntero de MYSQL
            var dataZ = convert.toDataZ(JSON.stringify(req.body)); //Convertir REQBODY
            console.log("DataZ:", dataZ); //Imprimir data resultante
            dataZ = convert.dataZToJson(dataZ) //Pasar a Json de nuevo
            res.statusCode = 200; //Asignar codigo de respuesta
            var json = {
                "msgType": "success",
                "message": "Json Recibido de manera exitosa",
                "datos": ""
            }
            json.datos = dataZ;
            //Meter los datos en un json para responder
            var jIQ3 = "INSERT INTO `datazs`(`IDDataZ`, `serial`,`date`, `num_repz`, `rif`, `alicuotas`, `desc_alicuotas`, `exnt`, `bi`, `nc_exento`, `nc_bi`, `des_exnt`, `des_bi`, `last_fact`, `last_doc_no_fi`, `last_nc`) VALUES ('','" + j.serial + "','" + j.date + "','" + j.num_repz + "','" + j.rif + "','" + j.alicuotas + "','" + j.desc_alicuotas + "','" + j.exnt + "','" + j.bi + "','" + j.nc_exento + "','" + j.nc_bi + "','" + j.des_exnt + "','" + j.des_bi + "','" + JSON.stringify(j.last_fact) + "','" + JSON.stringify(j.last_doc_no_fi) + "','" + JSON.stringify(j.last_nc) + "')";
            //Se prepara el Query con los datos

            connectionMysql.query(jIQ3, function(error, results, fields) {
                if (error) throw error;

                //console.log('The solution is: ', results[0].solution);
            });
            json.env = process.env;
            res.write(JSON.stringify(json));
            res.end();
            //console.log("Proceso Exitoso");
            //console.log("Devolver 200")
        } catch (err) {
            console.log("Error: Valor inválido");
            res.statusCode = 200;
            var jsonerror = {
                "msgType": "error",
                "message": "Error: Invalid value json for type dataZ",
                "datos": "nulo"
            };
            //console.log(err);
            res.write(JSON.stringify(jsonerror))
            res.end();
        }
    });

    app.post('/DataZ/DeleteAll', function(req, res) {
        console.log("Voy a borrar la tabla de los Z");
        //console.log(req.body); 
        try {
            var query2 = "TRUNCATE `datazs`";
            connectionMysql.query(query2, function(error, results, fields) {
                if (error) throw error;
                //console.log('The solution is: ', results[0].solution);
            });
            var resjson = {
                "msgType": "success",
                "message": "Se borró la base de datos con éxito",
                "datos": "nulo"
            };
            res.statusCode = 200; //Asignar codigo de respuesta
            res.write(JSON.stringify(resjson));
            res.end();
            //console.log("Proceso Exitoso");
            //console.log("Devolver 200")
        } catch (err) {
            console.log("Error: No se pudo Borrar:", err);
            res.statusCode = 200;
            var jsonerror = {
                "msgType": "error",
                "message": "Error:" + err + ".",
                "datos": "nulo"
            };
            //console.log(err);
            res.write(JSON.stringify(jsonerror))
            res.end();
        }
    });


    app.post('/DataZ/GetAll', function(req, res) {
        console.log("Voy a traer los reportes de:",req.body.serial);
        try {
            let query = "SELECT * FROM `datazs` WHERE `serial` = '"+req.body.serial+"'";
            connectionMysql.query(query, function(error, results, fields) {
                if (error) throw error;
                var resjson = {
                    "msgType": "success",
                    "message": "Traidos los dataZ del serial ",
                    "datos": results
                };
                res.statusCode = 200; //Asignar codigo de respuesta
                res.write(JSON.stringify(resjson));
                res.end();
            });



            //console.log("Proceso Exitoso");
            //console.log("Devolver 200")
        } catch (err) {
            console.log("Error: No se pudo Borrar:", err);
            res.statusCode = 200;
            var jsonerror = {
                "msgType": "error",
                "message": "Error:" + err + ".",
                "datos": "nulo"
            };
            //console.log(err);
            res.write(JSON.stringify(jsonerror))
            res.end();
        }
    });

    app.post('/DataZ/GetPrinters', function(req, res) {
        console.log("Voy a traer toda la tabla de las impresoras");
        console.log(req.body.rif);
        try {
            let query2 = "SELECT * FROM `impresoras` WHERE `RifImpresora` = 'J294087264'"
            let query = `SELECT * FROM "datazs" WHERE "serial" = "${req.body.rif}"`;
            connectionMysql.query(query2, function(error, results, fields) {
                if (error) throw error;
                var resjson = {
                    "msgType": "success",
                    "message": "Traidas las impresoras",
                    "datos": results
                };
                //-------------
                /*let o = results[0];
                o.totalventa=o.exnt+o.bi[0]+o.bi[1]+o.bi[2]+o.bi[3];*/
                //-------------

                //console.log();

                res.statusCode = 200; //Asignar codigo de respuesta
                res.write(JSON.stringify(resjson));
                res.end();
            });



            //console.log("Proceso Exitoso");
            //console.log("Devolver 200")
        } catch (err) {
            console.log("Error: No se pudo Borrar:", err);
            res.statusCode = 200;
            var jsonerror = {
                "msgType": "error",
                "message": "Error:" + err + ".",
                "datos": "nulo"
            };
            //console.log(err);
            res.write(JSON.stringify(jsonerror))
            res.end();
        }
    });


    app.post('/zServices', function(req, res) {

        res.setHeader('Content-Type', 'application/json');
        try {

            var dataZ = convert.toDataZ(JSON.stringify(req.body));
            console.log("DataZ:", dataZ);
            dataZ = convert.dataZToJson(dataZ)
            res.statusCode = 200;
            var json = {
                "msgType": "success",
                "message": "Json Recibido de manera exitosa",
                "datos": ""
            }
            json.datos = dataZ;
            json.env = process.env;
            res.write(JSON.stringify(json));
            res.end();
            //console.log("Proceso Exitoso");
            //console.log("Devolver 200")
        } catch (err) {
            //console.log("error");
            res.statusCode = 200;
            var jsonerror = {
                "msgType": "error",
                "message": "Error: Invalid value json for type dataZ",
                "datos": "nulo"
            };
            //console.log(err);
            res.write(JSON.stringify(jsonerror))
            res.end();
        }
        //Cambiar formato
        //Guardar Data  
        //catch

    });




    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //------------------------------------------------------------------





    // Setting the app router and static folder for image paths
    let imageOptions = _.map(config.uploads.images.options),
        defaultRoute = config.app.appBaseUrl + config.app.apiBaseUrl + config.uploads.images.baseUrl;
    _.forEach(imageOptions, (option) => {
        app.use(defaultRoute + '/' + option.finalDest, express.static(path.resolve(config.uploads.images.uploadRepository + option.finalDest), {
            maxAge: option.maxAge,
            index: option.index
        }));
    })
};

/**
 * Configure the server routes
 */
var responderSaludo = function(db, req, res) {
    //console.log(req.method);
    console.log(req.body);
    console.log(req.url);
    //console.log(req.headers)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // Note: the 2 lines above could be replaced with this next one:
    //res.writeHead(200, {'Content-Type': 'application/json'})
    //console.log(req.body);
    res.write(JSON.stringify(req.body));
    res.end();
    var saludo = "Hola";

    //db.collection("users").find();
    //res.write(JSON.stringify(saludo));


}
var initServerRoutes = function(app, config) {
    // Globbing routing files
    config.files.server.routes.forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Configure error handling
 */
var initErrorRoutes = function(app, config) {
    app.use(function(err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Redirect to error page
        let appBaseUrl = config.appBaseUrl || '/';
        res.redirect(appBaseUrl + 'server-error');
    });
};

/**
 * Configure Socket.io
 */
var configureSocketIO = function(app, db) {
    // Load the Socket.io configuration
    var server = require('./socket.io')(app, db);

    // Return server object
    return server;
};

var enableCORS = function(app) {
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Headers', 'content-type,devicetoken,usertoken');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', true);

        if (req.method === 'OPTIONS') {
            res.status(204).end();
        } else {
            next();
        }
    });
};

/**
 * Initialize the Express application
 */
var init = function(config, db) {
    // Initialize express app
    var app = express();

    // Initialize local variables
    initLocalVariables(app, config);

    // Initialize Express middleware
    initMiddleware(app, config);

    // Initialize Handlebars halper
    initHandlebars();

    // Initialize Express view engine
    initViewEngine(app, config);

    // Initialize Helmet security headers
    initHelmetHeaders(app);

    // Enable cors
    enableCORS(app);

    // Initialize modules static client routes, before session!
    initClientRoutes(app, config);

    // Initialize Express session
    initSession(app, config, db);

    //  Configure mongodb models
    initServerModels();

    // Initialize Modules configuration
    initServerConfiguration(app, config);

    // Initialize modules server routes
    initServerRoutes(app, config);

    // Initialize error routes
    initErrorRoutes(app, config);

    console.log('Loading Completed for:' + config.app.name);
    return app;
};

var initApps = function(db) {
    // need to decide if use express or connect??
    var rootApp = express();

    // assigning services to configs.
    config.services = require(path.resolve('./server/services.js'));

    // assigning helpers to configs
    config.helpers = require(path.resolve('./server/helpers.js'));

    // set up view
    config.serverViewPath = 'server';

    // set up static file location
    config.staticFiles = 'dist/' + config.app.name + '/';

    if (config.app.appBaseUrl) {
        rootApp.use(config.app.appBaseUrl, init(config, db));
    } else if (config.app.domainPattern) {
        rootApp.use(vhost(config.app.domainPattern, init(config, db)));
    }

    rootApp = configureSocketIO(rootApp, db);

    return rootApp;
};
module.exports.initAllApps = function(db, callback) {

    var rootApp = initApps(db);
    if (callback) {
        callback(rootApp);
    }
};