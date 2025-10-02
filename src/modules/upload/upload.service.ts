/* eslint-disable no-console */
import busboy from 'busboy';

export default class UploadService {
  private static instance: UploadService;

  constructor() {
    if (UploadService.instance) {
      return UploadService.instance;
    }

    UploadService.instance = this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(req, res) {
    const bb = busboy({ headers: req.headers });

    bb.on('file', (name, file, info) => {
      console.log(info, file, name);

      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );
      file
        .on('data', (data) => {
          console.log(`File [${name}] got ${data.length} bytes`);
        })
        .on('close', () => {
          console.log(`File [${name}] done`);
        });
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
    });
    bb.on('close', () => {
      console.log('Done parsing form!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
      res.end();
    });
    req.pipe(bb);
  }
}
