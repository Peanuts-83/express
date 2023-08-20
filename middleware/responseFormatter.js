/**
 * Formats any outgoing response on the desired shape
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseFormatter = (req, res, next) => {
    console.log('responseFormatter start')
    const originalJson = res.json
    console.log(res)
    res.json = body => {
        const formattedBody = {
            body
        }
        originalJson.call(res, formattedBody)
    }
    next()
}

module.exports = responseFormatter