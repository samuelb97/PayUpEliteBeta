const User = require("../../database_models/user_model");
const shortid = require("shortid");

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
                        if(!user.user_profile[0]){
                            user.user_profile.push({});
                            await user.user_profile[0].save();
                        }
                        if(!user.wallet[0]){
                            user.wallet.push({});
                            await user.wallet[0].save();
                        }
                        return h.view("profile", {user: user});
                    }
                }
            }
        ])
    }
}