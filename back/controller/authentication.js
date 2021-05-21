function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = {isAuthenticated, isNotAuthenticated}