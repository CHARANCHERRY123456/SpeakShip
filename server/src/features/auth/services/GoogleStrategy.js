// Google OAuth2 Strategy setup
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../../config/config.js'; // Fixed import path
import User from '../schema/User.js';

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL,
  passReqToCallback: true, // Allow access to req in verify callback
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Defensive: Check if profile.emails exists and has at least one email
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }
    // Get image, phone, address if available
    const image = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
    const phone = profile.phoneNumbers && profile.phoneNumbers.length > 0 ? profile.phoneNumbers[0].value : '';
    const address = profile.addresses && profile.addresses.length > 0 ? profile.addresses[0].formatted : '';
    // Get role from req.body or req.query (frontend must send it)
    let role = 'customer';
    if (req && req.body && req.body.role) {
      role = req.body.role;
    } else if (req && req.query && req.query.role) {
      role = req.query.role;
    }
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: profile.id,
        name: profile.displayName,
        email,
        image,
        phone,
        address,
        role,
      });
    } else if (user.role !== role) {
      // Optionally update role if user wants to switch (optional, can remove this block if not desired)
      user.role = role;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
