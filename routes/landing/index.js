const User = require("../../database_models/user_model");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function (server, options) {
        server.route([
            {
                method: "POST",
                path: "/fbLogin",
                config: {
                    auth: false,
                    handler: async function (request, h) {
                        console.log("fbLogin\n");
                        console.log('request', request.payload);
                        console.log('Hash: ', request.payload.id.hashCode());

                        var user = await User.findOne({ "email": request.payload.email }).exec();
                        if (!user) {  //make user with facebook credentials
                            user = new User({
                                "email": request.payload.email,
                                "name": request.payload.name,
                                "password": request.payload.id.hashCode(),
                            });
                            await user.save();
                            console.log("User created: ", request.payload.email);
                        }
                        var user = await User.findOne({ "email": request.payload.email }).exec();
                
                        console.log("User: ", user);
                        request.cookieAuth.set({ "user": user.email, "member_id": user.member_id, "name": user.name });
                        return h.response("successful login");
                    }
                }
            },
            {
                method: "POST",
                path: "/login",
                config: {
                    auth: false,
                    handler: async function (request, h) {
                        console.log('login request: ', request.payload);
                        var valid_user = await User.findOne({ "email": request.payload.email, "password": request.payload.password }).exec();
                        if (valid_user) {
                            console.log("valid user: ", valid_user);
                            if (!valid_user.user_profile[0]) {
                                 valid_user.user_profile.push({});
                            }
                            if (!valid_user.wallet[0]) {
                                valid_user.wallet.push({});
                           }
                            request.cookieAuth.set({ "user": valid_user.email, "member_id": valid_user.member_id, "name": valid_user.name });
                            console.log("Returning View Profile\n");
                            return h.response("successful login");
                        }
                        else{
                            console.log("invalid user\n");
                            return null;
                        }
                    }
                }
            },
            {
                method: "POST",
                path: "/sign_up",
                config: {
                    auth: false,
                    handler: async function (request, h) {
                        console.log('sign up request: ', request.payload);

                        var existing_user = await User.findOne({"email": request.payload.email}).exec();
                        if(existing_user){
                            console.log("Email has been registered\n");
                            return h.response("This email has been registered.").code(400);
                        }
                        else{
                            var user = new User({"email": request.payload.email, "name":request.payload.name, "password": request.payload.password});
                            user.user_profile.push({});
                            console.log(user.name, "User Created\n");
                            await user.save();
                            return h.response();
                        }
                    }
                }
            }
        ])
    }
}

String.prototype.hashCode = function () {
    var hash = 69;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 6) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}


