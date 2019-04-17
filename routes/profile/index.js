const User = require("../../database_models/user_model");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function(server, options){
        server.route([
            {
                method: "GET",
                path: "/profile",
                config: {
                    auth: "session",
                    handler: async function(request, h){
                        var user = await User.findOne({"email": request.auth.credentials.user}).exec();
                        console.log("Profile User: ", user);
                        return h.view("profile", {user: user});
                    }
                }
            }
        ])
    }
}