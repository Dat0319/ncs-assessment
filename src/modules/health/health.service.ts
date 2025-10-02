export class HealthService {
  private static instance: HealthService;

  constructor() {
    if (HealthService.instance) {
      return HealthService.instance;
    }

    HealthService.instance = this;
  }

  async ping() {
    return { message: 'Pong! 🐱‍👤' };
  }
}
