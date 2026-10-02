import ImageKit, {toFile} from "@imagekit/nodejs";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * @description Uploads an image to ImageKit
 * @param {Object} params - The parameters for the image upload
 * @param {Buffer} params.buffer - The buffer of the image to be uploaded
 * @param {string} params.fileName - The name of the file to be uploaded
 * @returns {Promise<Object>} - The response from ImageKit after the upload
 */
export const uploadImage = async ({buffer, originalname}) => {

    const fileName = originalname;
    const filePayLoad = buffer

    const response = await imagekit.files.upload({
        file: await toFile(filePayLoad),
        fileName: fileName,
        folder: "veto"
    })

    return response;
}