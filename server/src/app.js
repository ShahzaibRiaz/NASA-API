const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
// const passport = require("passport");
// const cookieSession = require("cookie-session");
// const { Strategy } = require("passport-google-oauth20");

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth/auth.router");

const app = express();

/** ------------------------------ */
/** COOKIE MIDDLEWARE */
/** ------------------------------ */
// app.use(
//   cookieSession({
//     name: "session",
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.COOKIE_KEY],
//   })
// );

/** ------------------------------ */
/** PASSPORT STRATEGY GOOGLE OAUTH2.0 */
/** ------------------------------ */
// app.use(passport.initialize());
// app.use(passport.session());
// /** ------------------------------ */
// /** PASSPORT STRATEGY GOOGLE OAUTH2.O */
// /** ------------------------------ */
// passport.use(
//   new Strategy(
//     {
//       clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       //   return cb(err, user);
//       // });
//       console.log("GOOGLE O.AUTH2.0 Profile", profile);
//       return cb(null, profile);
//     }
//   )
// );
// // Save the session to the cookie.
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// // Read the session from the cookie.
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

/** ------------------------------ */
/** GLOBAL MIDDLEWARE 
/** ------------------------------ */
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

/** ------------------------------ */
/** ROUTES */
/** ------------------------------ */
app.use("/v1", apiRouter);
app.use("/auth/google", authRouter);
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
