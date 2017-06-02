
const MsgBuilder = {
    missingFields: (response, fields) => {
        return response.status(400).json({
            message: 'Missing Fields',
            fields: fields || []
        });
    },

    success: (response, obj) => {
        return response.status(200).json({
            message: 'Success',
            data: obj || {}
        });
    },

    notFound: (response, msg) => {
        return response.status(404).json({
            message: msg || 'Not Found'
        });
    },

    internalError: (response, err) => {
        return response.status(500).json({
            message: 'Internal Server Error',
            error: err || {}
        });
    },

    unauthorized: (response, msg) => {
        return response.status(401).json({
            message: msg || 'Unauthorized Access'
        });
    },

    forbidden: (response, msg) => {
        return response.status(403).json({
            message: msg || 'Forbidden Access'
        });
    },

    badRequest: (response, msg) => {
        return response.status(400).json({
            message: msg || 'Bad Request'
        });
    }
};

module.exports = MsgBuilder;
