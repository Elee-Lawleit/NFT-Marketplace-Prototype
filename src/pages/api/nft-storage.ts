import formidable from "formidable"
import { readFileSync, unlinkSync } from "fs"
import { NextApiHandler } from "next"
import { File, NFTStorage } from "nft.storage"

const client = new NFTStorage({ token: `${process.env.NFT_STORAGE_KEY}` })

const handler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    return res.status(403).json({ error: `Unsupported method ${req.method}` })
  }
  try {
    // Parse req body and save image in /tmp
    const data: any = await new Promise((res, rej) => {
      const uploadDir = `${process.cwd()}/tmp`
      const form = formidable({ multiples: true, uploadDir })
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log("error: ", err)
          rej(err)
        }
        res({ ...fields, ...files })
      })
    })

    // Read image from /tmp
    const {
      filepath,
      originalFilename = "image",
      mimetype = "image",
    } = data.image
    console.log("Filepath from data.image: ", data.image.filepath)
    const buffer = readFileSync(data.image.filepath)
    console.log("buffer: ", buffer);
    const arraybuffer = Uint8Array.from(buffer).buffer
    console.log("array buffer", arraybuffer)
    const file = new File([arraybuffer], originalFilename, {
      type: mimetype,
    })
    console.log("FILE: ", file)
    // Upload data to nft.storage
    const metadata = await client.store({
      name: data.name,
      description: data.description,
      image: file,
    })
    // Delete tmp image
    unlinkSync(filepath)
    console.log("Destructured filepath: ", data.image.filepath)
    // return tokenURI
    res.status(201).json({ uri: metadata.url })
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

// Must disable bodyParser for formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
