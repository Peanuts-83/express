/**
 * Decode image buffer to HTML readable format (png actually).
 * Maybe could get some type option to manage different image formats (png|gif|jpg...) - to be implemented
 * @param {*} buffer - Image buffer
 * @returns String('base64') readable image
 */
const convertImageBufferToBase64 = (buffer) => {
    return buffer?.toString('base64')
}

exports.convertImageBufferToBase64 = convertImageBufferToBase64