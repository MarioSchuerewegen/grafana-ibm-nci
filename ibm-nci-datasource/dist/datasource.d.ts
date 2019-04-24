/// <reference path="../typings/tsd.d.ts" />
declare class IPMDatasource {
    private $q;
    private backendSrv;
    private templateSrv;
    name: string;
    url: string;
    appId: any;
    pk: any;
    alertSrv: any;
    tzOffset: string;
    sendHttpDelete: boolean;
    providerVersion: string;
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any, alertSrv: any);
    query(options: any): any;
    getDataSources(): any;
    getDataTypes(DataSource: any): string;
    getFields(DataSource: any, DataType: any): string;
    getTimeFields(DataSource: any, DataType: any): string;
    getPrimaryKey(DataSource: any, DataType: any): any;
    getParameters(DataSource: any, DataType: any): any;
    testDatasource(): any;
    parse(results: any): any[];
    getDatapoints(items: any, target: any): any[];
    getTarget(items: any, value: any): any;
    httpGet(request: any): any;
    doSimpleHttpGet(request: any): any;
}
export { IPMDatasource };
