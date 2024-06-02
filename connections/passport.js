const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const User = require("../models/users");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const user = await User.findOne({ googleId: profile.id });
      // 如果資料庫中已有此使用者，就取回資料
      if (user) {
        console.log("使用者已存在");
        return cb(null, user);
      }
      // // 如果資料庫中沒有此使用者，就新增一個
      const password = await bcrypt.hash("Asifh3nis72jgjksjd", 12);
      const newUser = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password,
        googleId: profile.id,
      });
      return cb(null, newUser);
    }
  )
);
