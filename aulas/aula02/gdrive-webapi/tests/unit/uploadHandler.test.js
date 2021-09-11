import { describe, test, expect, jest } from "@jest/globals";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "./_util/testUtil";

describe("UploadHanlder test suite", () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };
  
  describe("Register events", () => {
    test("should call onFile and onFinish functions on busboy instance", () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: "01",
      });
      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();

      const headers = {
        "content-type": "multipart/form-data; boundary=",
      };
      const onFinish = jest.fn();
      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);

      const fileSteam = TestUtil.generateReadableSteam(["chunk", "of", "data"]);
      busboyInstance.emit("file", "fieldname", fileSteam, "filename.txt");

      busboyInstance.listeners("finish")[0].call();

      expect(uploadHandler.onFile).toHaveBeenCalled();
      expect(onFinish).toHaveBeenCalled();
    });
  });
});
