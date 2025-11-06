const passErrorToView = (req, res, next) => {
    res.locals.error = ''
    next()
}

export default passErrorToView