const User = require("../../database_models/user_model");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function(server, options){
        server.route([
            {
                method: "GET",
                path: "/newChallenge",
                config: {
                    auth: "session",
                    handler: async function(request, h){
                        console.log("New Challenge\n");
                        return h.view("newChallenge");
                    }
                }
            }
        ])
    }
}