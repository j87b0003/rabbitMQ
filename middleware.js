const joi = require('joi')

module.exports = middleware = {
    validFields: async (req, resp, next) => {
        const schema = joi.object().keys({
            identifier: joi.string().required(),
            type: joi.string().required(),
            deviceId: joi.string().required(),
            text: joi.string().required()
        })

        const res = schema.validate(req.body, {
            abortEarly: false
        })

        if (res.error) {
            console.log(res.error)
            resp.status(422).send('Validation Error: Fields.')
        } else {
            next()
        }

    }
}