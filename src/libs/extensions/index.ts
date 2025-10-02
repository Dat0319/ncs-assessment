import expressResponseExt from './express.ext';

export default function registerExtensionMethod(): void {
  expressResponseExt();
}

export * from './base.repository';
