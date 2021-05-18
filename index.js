const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

const jwtSecret = 'd4e227b476f5';

app.use(express.json());

app.post('/sign-token', (req, res) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    id: req.body.id,
  };

  const expiry = 36000;

  //Check for required fields
  if (!payload.firstName || !payload.lastName || !payload.id) {
    res.status(400).json({
      status: 'fail',
      message: 'Please include first name, last name and id...',
    });
  }

  //Create token
  jwt.sign(payload, jwtSecret, { expiresIn: expiry }, (err, token) => {
    if (err) {
      res.status(500).json({ err });
    } else {
      res.status(200).json({ token });
    }
  });
});

app.get('/decode-token', (req, res) => {
  //Check for auth token
  if (!req.headers.authorization) {
    res.status(403).json({
      status: 'fail',
      message: 'Authentication token is required!',
    });
  }

  //Get token from header and separte from bearer
  const tokenArray = req.headers.authorization.split(' ');
  const jwtToken = tokenArray[1];

  //Verify Token
  jwt.verify(jwtToken, jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(500).json({ err });
    } else {
      res.status(200).json({ user: decodedToken });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
