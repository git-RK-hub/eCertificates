const stream = require('stream');
const fs = require('fs');
const formidable = require('formidable');
const Duplex = stream.Duplex || require('readable-stream').Duplex;
const AppError = require('../utils/AppError');
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
  const saltArray = process.env.CIPHER_SALT.split('').map((e) =>
    e.charCodeAt(0)
  );
  const cipherText = myData.cipherData;
  const cipherString = [];
  for (let i = 0; i < cipherText.length; i += 1) {
    if (cipherText[i].match(/[0-9]/g)) {
      cipherString[i] = cipherText[i];
    }
    if (cipherText[i].match(/[a-zA-Z]/g)) {
      cipherString[i] = String.fromCharCode(
        saltArray.reduce((a, b) => a ^ b, cipherText[i].charCodeAt(0))
      );
    }
  }
  const buffer = Buffer.from(myDecipher(cipherString.join('')), 'base64');
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

exports.saveDocument = async (req, res, next) => {
  try {
    let fileName;
    const myCipher = encryption.cipher(process.env.CIPHER_SALT);
    const form = new formidable.IncomingForm({});
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(400).json({ error: err });
      const file = files.docFile;
      if (!file || file === undefined) {
        return next(new AppError('No file found', 400));
      }

      // eslint-disable-next-line guard-for-in
      for (const property in fields) {
        req.body[property] = fields[property];
      }
      console.log(fields, files, req.body);
      const certiName = req.body.docName.toLowerCase().replace(/ /g, '-');
      fileName = file.name;
      fileName.replace(/ /g, '_');
      fs.readFile(file.path, async (error, data) => {
        if (error) {
          return res.status(400).json({ error });
        }
        const base64data = data.toString('base64');
        const encryptedText = myCipher(base64data);
        const saltArray = process.env.CIPHER_SALT.split('').map((e) =>
          e.charCodeAt(0)
        );
        const cipherString = [];
        for (let i = 0; i < encryptedText.length; i += 1) {
          if (encryptedText[i].match(/[0-9]/g)) {
            cipherString[i] = encryptedText[i];
          }
          if (encryptedText[i].match(/[a-zA-Z]/g)) {
            cipherString[i] = String.fromCharCode(
              saltArray.reduce((a, b) => a ^ b, encryptedText[i].charCodeAt(0))
            );
          }
        }
        const oldDoc = await Data.findOne({
          $and: [{ user: req.body.userId }, { certiName: certiName }]
        });
        if (oldDoc) {
          oldDoc.createdAt = new Date();
          oldDoc.cipherData = cipherString.join('');
          await oldDoc.save();
          return res.status(200).json({
            status: 'success',
            message: 'encryption done'
          });
        }
        const newData = new Data();
        newData.certiName = certiName;
        newData.createdAt = new Date();
        newData.user = req.body.userId;
        newData.cipherData = cipherString.join('');
        await newData.save();
        res.status(200).json({
          status: 'success',
          message: 'encryption done'
        });
      });
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }
};
