const stream = require('stream');
const Duplex = stream.Duplex || require('readable-stream').Duplex;
const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const Data = require('../Model/dataModel');
const encryption = require('../Model/encryption');

exports.createuserProfile = (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'This route is not defined, try /user/signup instead'
  });
};

exports.getAllUsersData = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: 'succes',
    result: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    data: null
  });
});

exports.decrypt = async (req, res) => {
  const certiName = req.body.certiName.replace(/ /g, '-');

  const myData = await Data.findOne({
    $and: [{ user: req.body.userId }, { certiName: certiName }]
  });
  const myDecipher = encryption.decipher(process.env.CIPHER_SALT);
  const buffer = Buffer.from(myDecipher(myData.cipherData), 'base64');
  const bufferToStream = (data) => {
    const a = new Duplex();
    a.push(data);
    a.push(null);
    return a;
  };
  bufferToStream(buffer).pipe(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${myData.certiName}`
  );
};
