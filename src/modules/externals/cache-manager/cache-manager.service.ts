export class CacheManagerService {
  private static instance: CacheManagerService;

  constructor() {
    if (CacheManagerService.instance) {
      return CacheManagerService.instance;
    }

    CacheManagerService.instance = this;
  }
}
