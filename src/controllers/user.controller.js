import { asyncHandler } from '../utils/asyncHandler.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { ApiResponse } from "../utils/ApiResponse.util.js"
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.util.js';

export const registerUser = asyncHandler(async (req, res) => {
    // console.log("step 1")
    // get user details from frontend
    const { username, email, fullName, password } = req.body;
    // console.log("step 2");
    // validation - not empty
    [username, email, fullName, password].forEach((ele) => {
        if (ele?.trim() === '') throw new ApiError(400, "all fields are required");
    })
    // console.log("step 3")
    // check if user already exists: username, email
    const existedUser = await User.findOne({ username: username });
    if (existedUser) throw new ApiError(409, "username already exists");
    const existedemail = await User.findOne({ email: email });
    if (existedemail) throw new ApiError(409, "email already exists");

    // console.log("step 4")
    // check for images, check for avatar
    // console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && req.files.coverImage)
        coverImageLocalPath = req.files.coverImage[0].path;

    // console.log("step 5")
    // upload them to cloudinary, avatar
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    // console.log("step 6")
    // create user object - create entry in db
    const user = await User.create({
        username,
        email,
        password,
        fullName,
        coverImage: coverImage?.url || "",
        avatar: avatar.url
    })

    // console.log("step 7")
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    // console.log("step 8")
    // check for user creation
    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user")
    // console.log("step 9")
    // return res

    return res.status(200).json(
        new ApiResponse(200, createdUser, "Registration Successfull")
    )
})
