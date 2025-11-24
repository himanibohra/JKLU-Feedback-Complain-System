const cloudinary = require("../Configs/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "jklu_feedback" },
      (error, response) => {
        if (error) return res.status(500).json({ error });

        return res.json({
          msg: "File uploaded successfully",
          url: response.secure_url
        });
      }
    );

    result.end(file.buffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    const uploadedFiles = [];

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