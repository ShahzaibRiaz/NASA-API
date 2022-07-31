const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

authRouter.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

authRouter.get(
  "/callback",
  passport.authenticate(
    "google",
    {
      failureRedirect: "/failure",
      successRedirect: "/",
      session: true, // Yon delete this property because it's default value to true
    }
    // (req, res) => {
    //   console.log("Google called us back");
    // }
  )
);

authRouter.get("/failure", function (req, res) {
  return res.send("Failed to login using google oAuth2.0");
});

module.exports = authRouter;
