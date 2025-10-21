import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../../config/config.js';
import Customer from '../schema/Customer.js';
import Driver from '../schema/Driver.js';

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL,
  passReqToCallback: true,
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    let role = req.query.role;
    if (req.query.state) {
      try {
        const state = JSON.parse(req.query.state);
        role = state.role || role;
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
    }

    if (!role || !['customer', 'driver'].includes(role)) {
      return done(new Error('Role must be customer or driver'), null);
    }

    let user = null;
    if (role === 'customer') {
      user = await Customer.findOne({ email });
    } else if (role === 'driver') {
      user = await Driver.findOne({ email });
    }

    if (!user) {
      return done(new Error('No account found for this Google email. Please register first.'), null);
    }

    user = user.toObject();
    user.role = role;
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