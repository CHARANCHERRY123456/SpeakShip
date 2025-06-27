// Google OAuth2 Strategy setup
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../../config/config.js'; // Fixed import path
import Customer from '../schema/Customer.js';
import Driver from '../schema/Driver.js';
import Admin from '../schema/Admin.js';

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL,
  passReqToCallback: true,
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }
    const image = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
    const phone = profile.phoneNumbers && profile.phoneNumbers.length > 0 ? profile.phoneNumbers[0].value : '';
    const address = profile.addresses && profile.addresses.length > 0 ? profile.addresses[0].formatted : '';
    let role = null;
    if (req && req.body && req.body.role) {
      role = req.body.role;
    } else if (req && req.query && req.query.role) {
      role = req.query.role;
    } else if (req && req.query && req.query.state) {
      try {
        const state = JSON.parse(req.query.state);
        if (state.role) role = state.role;
      } catch (e) {}
    }
    if (!role || !['customer', 'driver', 'admin'].includes(role)) {
      return done(new Error('Role is required and must be customer, driver, or admin.'), null);
    }
    if (role === 'admin') {
      return done(new Error('Admin registration is not allowed via OAuth'), null);
    }
    let user = null;
    if (role === 'customer') {
      user = await Customer.findOne({ email });
      if (!user) {
        return done(new Error('No account found for this Google email.'), null);
      }
      user = user ? user.toObject() : null;
      if (user) user.role = 'customer';
    } else if (role === 'driver') {
      user = await Driver.findOne({ email });
      if (!user) {
        return done(new Error('No account found for this Google email.'), null);
      }
      user = user ? user.toObject() : null;
      if (user) user.role = 'driver';
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
      if (!user) {
        return done(new Error('Admin registration is not allowed via OAuth'), null);
      }
      user = user ? user.toObject() : null;
      if (user) user.role = 'admin';
    } else {
      return done(new Error('Invalid role'), null);
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
    const customer = await Customer.findById(id);
    done(null, customer);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
