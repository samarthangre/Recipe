import jwt from 'jsonwebtoken';

const isAuthenticated =async (req, res, next) => {
    try{
        const token = req.cookies.token; // Get token from cookies by using cookies parser middleware
        if(!token) {
            return res.status(401).json({
                message: "You are not authenticated.",
                success: false
            });
        }
        const decoded =await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Token:", decoded);
        
        if(!decoded) {
            return res.status(401).json({message: "Invalid token."});
        }
        req.id = decoded.userId; // Attach user data to request object
        // Now one can access req.user in your route handlers
        next();
    }
    catch (error) {
        console.log(error);
    }
};
export default isAuthenticated;