import { asyncHandler } from '../utils/asyncHandler.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { ApiResponse } from "../utils/ApiResponse.util.js"
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.util.js';

const genarateRefreshAndAccessToken = async (user) => {
    const accessToken = user.genarateAccessToken();
    const refreshToken = user.genarateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
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
    if (req.files && req.files.coverImage)
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
});

const loginUser = asyncHandler(async function (req, res) {
    //get data from frontend
    //validate data 
    // console.log(req.header("Authorization"));
    const { email, username, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) throw new ApiError(404, "no user found with this username");
    if (!(await user.isPasswordCorrect(password))) throw new ApiError(401, "password did not match");

    const { accessToken, refreshToken } = await genarateRefreshAndAccessToken(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "User loggedIn successfully")
        )
})

const logoutUser = asyncHandler(async function (req, res) {
    //remove refreshToken cookie
    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 }
    }, { new: true })

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .clearCookie("accessToke", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const refreshAccessToken = asyncHandler(async function (req, res) {
    const { refreshToken } = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) throw new ApiError(401, "refresh token is missing");

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401, "invalid refresh token");
    }

    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(404, "no user found for this token");

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "refresh token did not match");
    }

    const {accessToken, newRefreshToken} = await user.genarateRefreshAndAccessToken();


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};
