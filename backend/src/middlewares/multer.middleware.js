import multer from "multer"
import asyncHandler from "../utils/asyncHandler.js";



const upload = multer({
  fileFilter: (req, file, cb) => {
    //reject file
    if(!file.originalname.match((/\.(jpg|jpeg|png|avif)$/))) {
        cb(new Error("File mimetype not supported allowed [jpeg,jpg,png,avif]"), false)
    }
    //accept file
    cb(null, true)

  },
  limits: {
    files: 2,
    fieldNameSize: 50,
    fileSize: 5 * 1024 * 1024, //1kilo byte => 1024 bytes thus 1mb => 1024 * 1024
  }
});

asyncHandler(
async(req, res, next) =>  upload() 
)
//name refers to input attribute name in frontend

//here req.file is the file in the name object
const uploadSingle = (name) => upload.single(name)

//here req.files is an array of files
const uploadMultipleFiles = (name, numberOfFiles) => upload.array(name, numberOfFiles);
//here req.files is an object with keys but  values are arrays
const uploadMultipleFields = (arrayOfFields) => upload.fields(arrayOfFields.map((field) => field))

//handle text only multipart form-data
const textOnlyMultipart = () => upload.none()

export {
    textOnlyMultipart,
    uploadMultipleFiles,
    uploadMultipleFields,
    uploadSingle,
   
}
