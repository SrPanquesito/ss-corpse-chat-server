const errorHandler = (error, req, res) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message || 'An error occurred'
    // const data = error.data; // Do not send back the whole error to the client
    res.status(status).json({
        success: false,
        errorMessage: message,
        data: null,
    })
}

module.exports = errorHandler
