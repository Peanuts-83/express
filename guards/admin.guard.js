const adminGuardMiddleware = (req,res,next) => {
    const user = req.user
    // check for admin profile and reject if not
    if (!user || user.profile!=='admin') {
        return res.status(403).json({message: 'Access denied - Admin access required'})
    }
    // proceed to next midleware or route handler
    next()
}

module.exports = adminGuardMiddleware