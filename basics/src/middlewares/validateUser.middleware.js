


export const validateUser = (schema) => async (req, res, next) => {
    try {
        schema.parse({ body: req.body });
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: err.errors ? err.errors.map(e => e.message).join(', ') : 'Invalid request data' });
    }
}