const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")


//**********Reset Password Token**********/
exports.resetPasswordToken = async (req, res) => {
  //every user 
  try {
    //get email from req body
    const email = req.body.email

    //check user for this email
    const user = await User.findOne({ email: email })
    //validate this email
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }

    //Generate a token for this user
    const token = crypto.randomBytes(20).toString("hex")
    //Another method to generate token
    // const token = crypto.randomUUID();

    //update user by adding token and expiration time
    await User.findOneAndUpdate(
      { email: email }, //search based on the email
      { //What you have to change: token and Expires date
        token: token, 
        resetPasswordExpires: Date.now() + 5*60*1000, //token will be valid till 5 minutes
      },
      { new: true } // new: true => means updated document will be returned in res.
    )
    // console.log("DETAILS", updatedDetails)

    //Generate the url for reset password
    // const url = `https://studynotion-frontend-75x4zppz3-sandip-kushwahas-projects.vercel.app/update-password/${token}`
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`
    const url = `https://studynotion-frontend-sandip.vercel.app/update-password/${token}`
    // const url = ` http://localhost:3000//update-password/${token}`

   

  // send the mail for reset password which contain the url
    await mailSender(
      email,
      "Password Reset Link",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    //return res.
    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Password Link.`,
    })
  }
}


//***********Reset Passward************/
exports.resetPassword = async (req, res) => {
  try {
    //token is send by front-end so we are taking it from body
    //Here we will use token to find user entry from DB

    //data fetch
    const { password, confirmPassword, token } = req.body

    //Validation
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }

    //get userDetails from DB using token
    const userDetails = await User.findOne({ token: token })
   //Validate userDetails
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      })
    }
    //validate token exiretion time if  
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }

    //hash the Password
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate(
      { token: token }, // find user on the basis of token
      { password: encryptedPassword }, // and update the password
      { new: true } // return the updated document
    )
    res.json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
