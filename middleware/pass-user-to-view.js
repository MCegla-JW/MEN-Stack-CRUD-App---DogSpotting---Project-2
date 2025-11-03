const passUserToView = (req, res, next) => {
    res.locals.user = req.session.use ? req.session.user : null
    next()
}

export default passUserToView