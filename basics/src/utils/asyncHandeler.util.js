

export const asynchandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(520).json(
                {
                    success: false,
                    message: error.message || 'Internal Server Error'
                }
            )
        }
    }
}