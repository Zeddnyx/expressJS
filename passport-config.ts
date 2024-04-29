import passportLocal from "passport-local";
import bcrypt from "bcrypt";

export default function passportConfig(passport: any, getUserByEmail: any, getUserById: any) {
  const auth = async (email: string, password: string, done: any) => {
    const user = getUserByEmail(email);
    user
      ? done(null, user)
      : done(null, false, { message: "Incorrect email." });

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: "email",
      },
      auth,
    ),
  );
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });
  passport.deserializeUser((id: any, done: any) => {
    done(null, getUserById(id));
  });
}
