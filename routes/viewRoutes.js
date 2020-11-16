const express = require('express');
const viewController = require('../Controller/viewController');
const authController = require('../Controller/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/').get(viewController.getOverview);
router
  .route('/dashboard/:userId')
  .get(authController.protect, viewController.getDashboard);
router.route('/allocate/:userId').get(viewController.allocatePage);

router.route('/savedocument/:userId').get(viewController.getSaveDoc);
// router.route('/signup').get(viewController.getSignup);
// router.route('/doctors').get(viewController.getDoctors);
// router
//   .route('/patient-dashboard')
//   .get(authController.protect, viewController.getPatientProfile);

module.exports = router;
