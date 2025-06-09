// Google OAuth2 Strategy setup
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../../config/config.js'; // Fixed import path
import User from '../schema/User.js';

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Defensive: Check if profile.emails exists and has at least one email
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }
    // Get image, phone, address if available
    const image = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
    // Google profile rarely provides phone/address, but check if present
    const phone = profile.phoneNumbers && profile.phoneNumbers.length > 0 ? profile.phoneNumbers[0].value : '';
    const address = profile.addresses && profile.addresses.length > 0 ? profile.addresses[0].formatted : '';
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: profile.id,
        name: profile.displayName,
        email,
        image, // Store Google image or empty string
        phone, // Store phone if available
        address, // Store address if available
        role: 'customer',
      });
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
