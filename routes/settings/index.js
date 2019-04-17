const User = require("../../database_models/user_model");
const shortid = require("shortid");
const fs = require("fs");

module.exports.plugin = {
    pkg: require("./package.json"),
    register: function(server, options){
        server.route([
            {
                method: "GET",
                path: "/settings",
                config: {
                    auth: "session",
                    handler: async function(request, h){
                        var user = await User.findOne({"email": request.auth.credentials.user}).exec();
                        return h.view("settings", {user: user});
                    }
                }
            },
            {
                method: "POST",
                path: "/user_profile/edit",
                config: {
                    auth: "session",
                    handler: async function (request, h) {
                        console.log("Payload: ", request.payload);
                        var user = await User.findOne({ "email": request.auth.credentials.user }).exec();
                        if (!user.user_profile[0]) {
                            user.user_profile.push({});
                        }
                        user.name = request.payload.name;
                        user.user_profile[0].location = request.payload.location;
                        user.user_profile[0].bio = request.payload.bio;
                        //user.markModified('user_profile')
                        console.log("new location: ", user.user_profile[0].location)
                        var saved = await user.save();
                        console.log("Saved: ", saved);
                        if (saved) {
                            return h.response();
                        }
    
                    }
                }
            },
            {
                method: "POST",
                path: "/profile_pic/upload",
                config: {
                    auth: "session",
                    handler: async function (request, h) {
                        //console.log("image_data", request.payload.image_data);
                        var user_profile_image = "user_" + request.auth.credentials.member_id + "_" + shortid.generate() + "." + request.payload.image_type;
                        fs.writeFile("user_profile_images/" + user_profile_image, new Buffer(request.payload.image_data, "base64"), async function (err) {
                            var user = await User.findOne({ "email": request.auth.credentials.user });
                            user.user_profile[0].profile_pic = user_profile_image;
                            var saved = await user.save();
                            if (saved) {
                                //UserStatus.update({ "user_email": request.auth.credentials.user }, { "profile_pic": user_profile_image });
                                h.response(user_profile_image);
                            }
                        });
                        return null;
                    }
                }
            }
        ])
    }
}