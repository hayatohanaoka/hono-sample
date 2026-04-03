export class ArticlesGateway {
    qiitaDriver;
    zennDriver;
    constructor(qiitaDriver, zennDriver) {
        this.qiitaDriver = qiitaDriver;
        this.zennDriver = zennDriver;
    }
    get() {
        throw new Error("Method not implemented.");
    }
}
