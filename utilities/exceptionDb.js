function getException(error) {
    let exception = {};
    switch (error.class) {
        case 14:
            exception.StatusCode = 414;
            exception.Message = error.message;
            return exception;
        default:
            exception.StatusCode = 400;
            exception.Message = error.message;
            return exception;
    }
}

module.exports = {
    getException
}