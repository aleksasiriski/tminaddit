function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        next()
    }
}

function isAdmin(req, res, next) {
    if (req.session.passport.user.admin == true) {
        next()
    } else {
        res.status(403)
    }
}

module.exports = {isAuthenticated, isNotAuthenticated, isAdmin}