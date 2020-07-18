export class AppSettings {
  public static get API_ENDPOINT(): string {
    return 'http://metabolitics.biodb.sehir.edu.tr/api';
     // return 'http://127.0.0.1:5000';
  }

  public static get NOTIFICATION_OPTIONS() {
    return { timeOut: 10000 };
  }
}
