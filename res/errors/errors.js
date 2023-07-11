const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errhandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? `Error with status code ${statusCode}.` : err.stack,
    })
}

module.exports = { errhandler, notFound }

