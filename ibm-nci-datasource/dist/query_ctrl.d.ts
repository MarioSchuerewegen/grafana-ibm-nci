/// <reference path="../typings/tsd.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
declare class IPMQueryCtrl extends QueryCtrl {
    private uiSegmentSrv;
    columns: any;
    colSegments: any;
    scope: any;
    static templateUrl: string;
    refresh: any;
    metric_types: any;
    datasource: any;
    type: any;
    at: any[];
    ag: any[];
    atr: any[];
    pk: any[];
    ai: any[];
    showPrimaryKey: boolean;
    timeAttributes: {
        name: string;
        value: string;
    }[];
    valueAttributes: {
        name: string;
        value: string;
    }[];
    timeRangeAttributes: {
        name: string;
        value: string;
    }[];
    /** @ngInject **/
    constructor($scope: any, $injector: any, uiSegmentSrv: any);
    tagSegmentUpdated(col: any, index: any): void;
    setColSegments(): void;
    getDataSources(): any;
    DataSources(): any;
    getDataTypes(): any;
    DataTypes(): any;
    getFields(): any;
    Fields(): any;
    getTimeFields(): any;
    TimeFields(): any;
    getParameters(): any;
    getPrimaryKey(): any;
    PrimaryKey(): any;
    onChangeDataSource(): void;
    onChangeFields(): void;
    onChangeInternal(): void;
    onChangeDataType(): void;
    onChangeParameters(): void;
}
export { IPMQueryCtrl };
