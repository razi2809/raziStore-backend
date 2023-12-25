import passport from "passport";
import { Profile } from 'passport-google-oauth20';

var GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID="359216031631-bq0dc1uesesukf9gupi337528ik82ho5.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/google/callback"
  },
  function(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
    return done( profile);
}
  ));

  passport.serializeUser(function(user,done){
    done(null,user)
  })
  passport.deserializeUser(function(user,done){
    done(null,user as any )
  })