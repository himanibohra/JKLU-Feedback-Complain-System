const cloudinary = require("../Configs/cloudinary");
const Attachment = require("../Models/attachment");

exports.uploadAttachments = async (req, res) => {
  try {
    const complaint_id = req.body.complaint_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    let uploadedFiles = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "jklu_feedback" },
          (error, response) => {
            if (error) reject(error);
            else resolve(response);
          }
        );
        stream.end(file.buffer);
      });

      // Save to database
      await Attachment.add(complaint_id, result.secure_url);

      uploadedFiles.push(result.secure_url);
    }

    res.json({
      msg: "Files uploaded successfully",
      files: uploadedFiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
