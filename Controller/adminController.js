const formidable = require('formidable');
const fs = require('fs');
const Data = require('../Model/dataModel');
const encryption = require('../Model/encryption');
const AppError = require('../utils/AppError');

exports.encrypt = async (req, res, next) => {
  try {
    let fileName;
    const myCipher = encryption.cipher(process.env.CIPHER_SALT);
    const form = new formidable.IncomingForm({});
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(400).json({ error: err });
      const file = files.certificate;
      if (!file || file === undefined) {
        return next(new AppError('No file found', 400));
      }

      // eslint-disable-next-line guard-for-in
      for (const property in fields) {
        req.body[property] = fields[property];
      }
      const certiName = req.body.certiname.toLowerCase().replace(/ /g, '-');
      fileName = file.name;
      fileName.replace(/ /g, '_');
      fs.readFile(file.path, async (error, data) => {
        if (error) {
          return res.status(400).json({ error });
        }
        const base64data = data.toString('base64');
        const oldDoc = await Data.findOne({
          $and: [{ user: req.body.userId }, { certiName: certiName }]
        });
        if (oldDoc) {
          oldDoc.createdAt = new Date();
          oldDoc.cipherData = myCipher(base64data);
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
        newData.cipherData = myCipher(base64data);
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
