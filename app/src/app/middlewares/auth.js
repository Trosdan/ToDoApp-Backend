import express from 'express';
import * as admin from 'firebase-admin';

export default async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    if (decodedIdToken) {
      req.user = decodedIdToken;
      return next();
    }
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    return res.status(401).send('Unauthorized');
  }
};
