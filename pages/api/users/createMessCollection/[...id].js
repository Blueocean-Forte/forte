import { db } from '../../../../firebase';

export default async function handler(req, res) {
  const id = req.query.id[0];

  const userRef = db.collection('users').doc(id)
    .collection('messages');

  userRef
    .doc(id)
    .set({})
    .then(() => {
      res.status(200).json('collection added!');
    })
    .catch((err) => {
      console.log('error', err);
    });
}
