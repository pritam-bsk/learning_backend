import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }
})