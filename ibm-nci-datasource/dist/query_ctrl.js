System.register(['app/plugins/sdk', 'lodash'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1, lodash_1;
    var IPMQueryCtrl;
    return {
        setters:[
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            IPMQueryCtrl = (function (_super) {
                __extends(IPMQueryCtrl, _super);
                /** @ngInject **/
                function IPMQueryCtrl($scope, $injector, uiSegmentSrv) {
                    _super.call(this, $scope, $injector);
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.timeAttributes = [
                        { name: 'TIMESTAMP', value: 'TIMESTAMP' },
                        { name: 'WRITETIME', value: 'WRITETIME' }
                    ];
                    this.valueAttributes = [
                        { name: 'value', value: 'value' },
                        { name: 'displayValue', value: 'displayValue' }
                    ];
                    this.timeRangeAttributes = [
                        { name: 'Dashboard time range', value: 'dashboard' },
                        { name: 'Current value', value: 'current' }
                    ];
                    this.scope = $scope;
                    this.uiSegmentSrv = uiSegmentSrv;
                    var target_defaults = {
                        DataSource: '',
                        DataType: '',
                        Field: '',
                        PrimaryKey: ''
                    };
                    lodash_1.default.defaultsDeep(this.target, target_defaults);
                    this.target.timeAttribute = this.target.timeAttribute || 'TIMESTAMP';
                    this.target.valueAttribute = this.target.valueAttribute || 'displayValue';
                    this.target.timeRangeAttribute = this.target.timeRangeAttribute || 'dashboard';
                    //   
                    this.target.table = this.target.table || '/';
                    this.target.columns = this.target.columns || [{ text: 'Parameters not yet gathered, select Datasource AND Datatype' }];
                    this.target.condition = this.target.condition || '';
                    this.target.type = this.target.type || 'table';
                    this.setColSegments();
                    //    
                }
                ;
                IPMQueryCtrl.prototype.tagSegmentUpdated = function (col, index) {
                    var _this = this;
                    var cntr = 0;
                    this.target.columns.forEach(function (OneColumn) {
                        if (OneColumn.text == col.text) {
                            _this.target.columns[cntr] = { text: col.text, value: col.value };
                        }
                        cntr = cntr + 1;
                    });
                    if (col.value == "-- remove --") {
                        this.target.columns.splice(index, 1);
                    }
                    this.setColSegments();
                    this.onChangeInternal();
                    return;
                };
                IPMQueryCtrl.prototype.setColSegments = function () {
                    var _this = this;
                    this.colSegments = [];
                    if (!Array.isArray(this.target.columns)) {
                        if (!this.target.columns) {
                            this.target.columns = [{ text: '*' }];
                        }
                        else {
                            this.target.columns = this.target.columns.split("\s*,\s*");
                        }
                    }
                    this.target.columns.forEach(function (col) {
                        if (col.text != 'Parameters not yet gathered, select Datasource AND Datatype') {
                            _this.colSegments.push(_this.uiSegmentSrv.newCondition(col.text));
                            _this.colSegments.push(_this.uiSegmentSrv.newSegment({ value: col.value }));
                        }
                        else {
                            _this.colSegments.push(_this.uiSegmentSrv.newOperator(col.text));
                        }
                    });
                    if (this.colSegments.length == 0) {
                    }
                    else {
                        if (this.colSegments[this.colSegments.length - 1].text && this.colSegments[this.colSegments.length - 1].text.match(/\(\)$/)) {
                            this.colSegments.push(this.uiSegmentSrv.newSegment({ value: ' ' }));
                        }
                    }
                    //this.colSegments.push(this.uiSegmentSrv.newPlusButton());
                    //this.colSegments.push(this.uiSegmentSrv.newCondition( "executePolicy" ));
                    //this.colSegments.push(this.uiSegmentSrv.newSegment({ text: 'executePolicy' , value: 'true' }));
                };
                //end test
                IPMQueryCtrl.prototype.getDataSources = function () {
                    if (this.at) {
                        return Promise.resolve(this.at);
                    }
                    else {
                        return this.datasource.getDataSources()
                            .then(function (items) {
                            return items.sort(function (a, b) {
                                return (a.description > b.description ? 1 : -1);
                            });
                        });
                    }
                };
                IPMQueryCtrl.prototype.DataSources = function () {
                    return this.getDataSources().then(function (items) {
                        return lodash_1.default.map(items, function (item) {
                            return { text: item.id, value: item.id };
                        });
                    });
                };
                IPMQueryCtrl.prototype.getDataTypes = function () {
                    var target = this.target.DataSource;
                    return this.datasource.getDataTypes(target)
                        .then(function (items) {
                        return items.sort(function (a, b) {
                            return (a.description > b.description ? 1 : -1);
                        });
                    });
                };
                IPMQueryCtrl.prototype.DataTypes = function () {
                    return this.getDataTypes().then(function (items) {
                        var filtered = items.filter(function (item) { return item.notAvailableInPreFetch != true; });
                        return filtered.map(function (item) {
                            return { text: item.id, value: item.id };
                        });
                    });
                };
                IPMQueryCtrl.prototype.getFields = function () {
                    var target = this.target.DataSource;
                    var aG = this.target.DataType;
                    return this.datasource.getFields(target, aG)
                        .then(function (items) {
                        return items.sort(function (a, b) {
                            return (a.label > b.label ? 1 : -1);
                        });
                    });
                };
                IPMQueryCtrl.prototype.Fields = function () {
                    return this.getFields().then(function (items) {
                        return lodash_1.default.map(items, function (item) {
                            return { text: item.label, value: item.id };
                        });
                    });
                };
                IPMQueryCtrl.prototype.getTimeFields = function () {
                    var _this = this;
                    var target = this.target.DataSource;
                    var aG = this.target.DataType;
                    var This = this;
                    var TimeFields = [];
                    this.target.timeAttribute = [];
                    return this.datasource.getTimeFields(target, aG)
                        .then(function (items) {
                        items.forEach(function (OneItem) {
                            if (OneItem.valueType == 'isodatetime') {
                                TimeFields.push(OneItem);
                                This.timeAttributes.push({ name: OneItem.label, value: OneItem.label });
                            }
                            else if (OneItem.valueType == 'datetime') {
                                TimeFields.push(OneItem);
                                This.timeAttributes.push({ name: OneItem.label, value: OneItem.label });
                            }
                        });
                        This.timeAttributes.reverse();
                        _this.target.valueAttribute = [{ name: 'value', value: 'value' }];
                        return TimeFields;
                    });
                };
                IPMQueryCtrl.prototype.TimeFields = function () {
                    return this.getTimeFields().then(function (items) {
                        return lodash_1.default.map(items, function (item) {
                            return { text: item.label, value: item.id };
                        });
                    });
                };
                IPMQueryCtrl.prototype.getParameters = function () {
                    var This = this;
                    var target = this.target.DataSource;
                    var aG = this.target.DataType;
                    return this.datasource.getParameters(target, aG)
                        .then(function (params) {
                        This.colSegments = [];
                        This.target.columns = params;
                        if (params.length > 0) {
                            params.forEach(function (col) {
                                if (col.text != 'Parameters not yet gathered, select Datasource AND Datatype') {
                                    This.colSegments.push(This.uiSegmentSrv.newCondition(col.text));
                                    //This.colSegments.push(This.uiSegmentSrv.newKey( col.text ));
                                    //This.colSegments.push(This.uiSegmentSrv.newSegment({ value: col.text }));
                                    This.colSegments.push(This.uiSegmentSrv.newKeyValue(col.text));
                                }
                                else {
                                    This.colSegments.push(This.uiSegmentSrv.newOperator(col.text));
                                }
                            });
                        }
                        else {
                            This.colSegments.push(This.uiSegmentSrv.newOperator('Policy has no Input Parameter defined use Condition below..'));
                        }
                        //console.log(params ,"==>" , typeof(params));
                        return;
                    })
                        .then(function () {
                        //              This.setColSegments();
                        This.onChangeInternal();
                    });
                };
                ;
                IPMQueryCtrl.prototype.getPrimaryKey = function () {
                    var _this = this;
                    var target = this.target.DataSource;
                    var aG = this.target.DataType;
                    if (target == "") {
                        return [];
                    }
                    return this.datasource.getPrimaryKey(target, aG).then(function (items) {
                        _this.pk = items.sort(function (a, b) {
                            return (a.label > b.label ? 1 : -1);
                        });
                        return items;
                    });
                };
                IPMQueryCtrl.prototype.PrimaryKey = function () {
                    return this.getPrimaryKey().then(function (items) {
                        return lodash_1.default.map(items, function (item) {
                            return { text: item.label, value: item.id };
                        });
                    });
                };
                IPMQueryCtrl.prototype.onChangeDataSource = function () {
                    this.target.datatype = null;
                    this.refresh();
                };
                IPMQueryCtrl.prototype.onChangeFields = function () {
                    this.showPrimaryKey = true;
                    this.refresh();
                };
                IPMQueryCtrl.prototype.onChangeInternal = function () {
                    this.showPrimaryKey = true;
                    this.refresh();
                };
                IPMQueryCtrl.prototype.onChangeDataType = function () {
                    this.getParameters();
                    this.getTimeFields();
                    this.refresh();
                };
                IPMQueryCtrl.prototype.onChangeParameters = function () {
                    console.log(this.target.columns);
                    Promise.resolve(this.target.columns);
                };
                ;
                IPMQueryCtrl.templateUrl = 'partials/query.editor.html';
                return IPMQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("IPMQueryCtrl", IPMQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map