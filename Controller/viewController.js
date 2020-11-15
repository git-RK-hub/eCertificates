const User = require('../Model/userModel');
const Data = require('../Model/dataModel');

exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    title: 'Private Dlocker'
  });
};

exports.getDashboard = async (req, res) => {
  const users = await User.find({ role: 'user' });
  const docs = await Data.find({ user: req.params.userId });
  res.status(200).render('dashboard', {
    title: 'Private Dlocker',
    users,
    docs
  });
};

exports.allocatePage = async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.status(200).render('allocate', {
    title: 'Private Dlocker',
    user
  });
};

exports.getDoctorProfile = async (req, res) => {
  // const bookings = await Bookings.find({ doctor: req.doctor.id });
  res.status(200).render('doctorProfile', {
    title: 'Dashboard | Doctor',
    page: 'profile'
    // bookings
  });
};

exports.bookAppointment = async (req, res) => {
  // const doctor = await Doctor.findById(req.params.id);
  // const slots = await Slots.findOne({ doctor: { _id: req.params.id } });
  res.status(200).render('bookingSlots', {
    title: 'Book Appointment'
    // doctor,
    // slots
  });
};

exports.bookingPayment = async (req, res) => {
  res.status(200).render('bookingPayment', {
    title: 'Payment | Book Slot'
  });
};
