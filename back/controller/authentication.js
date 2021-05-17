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

function isAdmin(req, res, next) {
    if (req.session.passport.user.admin == true) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = {isAuthenticated, isNotAuthenticated, isAdmin}