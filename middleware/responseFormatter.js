/**
 * Formats any outgoing response on the desired shape
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseFormatter = (req, res, next) => {
    const originalJson = res.json
    res.json = body => {
        const formattedBody = {
            status: res.statusCode,
            body: body
        }
        originalJson.call(res, formattedBody)
    }
    next()
}

module.exports = responseFormatter