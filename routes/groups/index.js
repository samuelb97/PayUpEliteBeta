const User = require("../../database_models/user_model");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function(server, options){
        server.route([
            {
                method: "GET",
                path: "/groups",
                config: {
                    auth: "session",
                    handler: async function(request, h){
                        var users = await User.find({"email": {$ne: request.auth.credentials.user}}).exec();
                        return h.view("groups", {user_friends: users});
                    }
                }
            }
        ])
    }
}