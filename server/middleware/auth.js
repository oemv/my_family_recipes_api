import jwt from 'jsonwebtoken';
import { MFR_SECRET } from '../constants';

export default function authenticate(req, res, next) {
  var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, MFR_SECRET, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
        success: false,
        message: 'Access token must be provided.'
    });
  }
}
