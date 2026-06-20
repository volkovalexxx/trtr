export class DashboardModel {
  constructor(raw) {
    this.profile = raw.profile;
    this.balance = raw.balance;
    this.assets = raw.assets;
    this.transactions = raw.transactions;
  }
}
