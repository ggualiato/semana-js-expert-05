import { describe, test, expect, jest } from "@jest/globals";
import { FileHelper } from "../../src/fileHelper.js";
import fs from "fs";

describe("FileHelper test suite", () => {
  describe("getFileStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const staticMock = {
        dev: 571521434,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 7318349394864998,
        size: 11,
        blocks: 0,
        atimeMs: 1631146865934.9756,
        mtimeMs: 1631146865934.9756,
        ctimeMs: 1631146865934.9756,
        birthtimeMs: 1631064918206.3604,
        atime: "2021-09-09T00:21:05.935Z",
        mtime: "2021-09-09T00:21:05.935Z",
        ctime: "2021-09-09T00:21:05.935Z",
        birthtime: "2021-09-08T01:35:18.206Z",
      };
      const mockUser = "ggualiato";
      const mockFilename = "file.png";
      process.env.USER = mockUser;

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([mockFilename]);
      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(staticMock);

      const result = await FileHelper.getFilesStatus("/tmp");

      const expectedResult = [
        {
          size: "11 B",
          lastModified: staticMock.birthtime,
          owner: mockUser,
          file: mockFilename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${mockFilename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
