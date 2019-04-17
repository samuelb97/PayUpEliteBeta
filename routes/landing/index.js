const User = require("../../database_models/user_model");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function(server, options){
        server.route([
            {
                method: "POST",
                path: "/fbLogin",
                config: {
                    auth: false,
                    handler: async function(request, h){
                        console.log("fbLogin\n");
                        console.log('request', request.payload);

                        var users = await User.find({"email": {$ne: request.auth.credentials.user}}).exec();
                        return h.view("friends", {user_friends: users});
                    }
                }
            }
        ])
    }
}

