const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const publicKEY = fs.readFileSync(path.join(__dirname + '/public.key'), 'utf8');
const privateKEY = fs.readFileSync(path.join(__dirname + '/private.key'), 'utf8');

const i = 'business';    	// Issuer (Software organization who issues the token)
const s = 'admin@business.se';	// Subject (intended user of the token)
const a = 'https://business.se';	// Audience (Domain within which this token will live and function)

module.exports = {
  sign: (payload) => {
    // Token signing options
    var signOptions = {
      issuer: i,
      subject: s,
      audience: a,
      expiresIn: "12h",    // 30 days validity
      algorithm: "RS256"
    };
    return jwt.sign(payload, privateKEY, signOptions);
  },
}