import Busboy from "busboy";
import { pipeline } from "stream/promises";
import fs from "fs";
import { logger } from "./logger.js";
export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder }) {
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
  }

  handleFileBytes() {}

  async onFile(fieldname, file, filename) {
    const saveTo = `${this.downloadsFolder}/${filename}`;

    await pipeline(
      file, //fist step, get an readable stream
      this.handleFileBytes.apply(this, [filename]), // second step, filter, convert and transform data
      fs.createWriteStream(saveTo) // third step, process output and writable stream
    );

    logger.info(`File [${filename}] finishe`);
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });

    busboy.on("file", this.onFile.bind(this));
    busboy.on("finish", onFinish);

    return busboy;
  }
}
