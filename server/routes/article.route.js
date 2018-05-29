import express from 'express';
import passport from 'passport';

import articleCtrl from '../controllers/article.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.use(passport.authenticate('jwt', { session: false }));

router.route('/')
    .get(articleCtrl.index);

export default router;
