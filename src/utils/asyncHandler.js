// export const asyncHandler = (func) => {
//     return (req,res,next) => {
//         const promise = new Promise((res,rej)=>{

//         }).then(()=>{
//             func(req,res,next);
//         })
//     }
// }

export const asyncHandler = (func) => async (req,res,next) => {
    try {
        return await func(req,res,next);
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}