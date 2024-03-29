'use strict';

const Hapi = require('hapi');
const mongoose = require("mongoose");
const User = require("./database_models/user_model");
const node_connect_db = mongoose.connect("mongodb+srv://jmoon9:qwerty123@cluster0-1dt1c.mongodb.net/node_connect", {useNewUrlParser: true});

var fbAppID = '281826302747123';

let start = async function () {
    const server = Hapi.server({ port: 3000 });
    await server.register([
        require('hapi-auth-cookie'),
        require("inert"),
        require("vision"),
    ]);
    await server.views({
        engines:{
            ejs: require("ejs")
        },
        relativeTo: __dirname,
        path:"views"  
    });

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'payUp_cookie',
            password: '32charAllChocolateChipNoOatmeals',
            isSecure: false,
            isSameSite: 'Lax'
        },
    });

    server.auth.default('session');

    await server.register([
        require("./routes/banter"),
        require("./routes/friends"),
        require("./routes/profile"),
        require("./routes/groups"),
        require("./routes/settings"),
        require("./routes/landing"),
        require("./routes/newChallenge"),
    ]);

    server.route([
        {
            method: "GET",
            path: "/{param*}",
            config: {
                auth: false,
                handler:{
                    directory: {
                        path: "public"
                    }
                }
            }
            
        },
        {
            method: "GET",
            path: "/", 
            config: {
                auth: { mode: 'try' }, 
                plugins: { 
                    'hapi-auth-cookie': {
                        redirectTo: false 
                    } 
                },
                handler: function(request,h){
                    console.log('Landing');
                    return h.view("landing", {appID: fbAppID});
                }
            }
        },
        {
            method: "GET",
            path: "/user_profile_images/{param*}",
            config: {
                auth: false,
                handler: {
                    directory: {
                        path: "user_profile_images"
                    }
                }
            }
        }
    ]);

    await server.start();

    console.log(`Server started at: ${server.info.uri}`);
};

start();