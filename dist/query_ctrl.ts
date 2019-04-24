///<reference path="../typings/tsd.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
import _ from 'lodash';

class IPMQueryCtrl extends QueryCtrl {
    columns: any;
    colSegments: any;
  scope: any;
  static templateUrl = 'partials/query.editor.html';
  refresh: any;
  metric_types: any;
  datasource: any;
  type: any;
  at: any[];  //Agent Types
  ag: any[];  //DataTypes
  atr: any[];  //Fields for Attribute Group
  pk: any[];  //Primary Key for Attribute Group
  ai: any[];   //Agent Instances
  showPrimaryKey: boolean;

  timeAttributes = [
    { name: 'TIMESTAMP', value: 'TIMESTAMP' },
    { name: 'WRITETIME', value: 'WRITETIME' }
  ];

  valueAttributes = [
    { name: 'value', value: 'value' },
    { name: 'displayValue', value: 'displayValue' }
  ];

  timeRangeAttributes = [
    { name: 'Dashboard time range', value: 'dashboard' },
    { name: 'Current value', value: 'current' }
  ]

  /** @ngInject **/
  constructor($scope, $injector  , private uiSegmentSrv) {


    super($scope, $injector);
    this.scope=$scope;
    this.uiSegmentSrv = uiSegmentSrv;
    
    let target_defaults = {
            DataSource: '',
            DataType: '',
            Field: '',
            PrimaryKey: ''
    }
    _.defaultsDeep(this.target, target_defaults);
    this.target.timeAttribute = this.target.timeAttribute || 'TIMESTAMP';
    this.target.valueAttribute = this.target.valueAttribute || 'displayValue';
    this.target.timeRangeAttribute = this.target.timeRangeAttribute || 'dashboard';
    ﻿
 //   
    
 
    this.target.table     = this.target.table     || '/';
    this.target.columns   = this.target.columns   || [{text: 'Parameters not yet gathered, select Datasource AND Datatype'}];
    this.target.condition = this.target.condition || '';
    this.target.type = this.target.type || 'table';
    this.setColSegments();
//    
  };
  
  
  tagSegmentUpdated(col,index) {
      var cntr=0;
      this.target.columns.forEach(OneColumn =>{
          if (OneColumn.text == col.text){
              this.target.columns[cntr] = {text: col.text , value: col.value};
          }
          cntr=cntr+1;
       });
      if(col.value == "-- remove --") {
        this.target.columns.splice(index, 1);
      }
      this.setColSegments();
      this.onChangeInternal();
      return;
  }
  
  setColSegments() {
      this.colSegments = [];
      if(!Array.isArray(this.target.columns)) {
        if(!this.target.columns) {
          this.target.columns = [{text: '*'}]
        }else {
          this.target.columns = this.target.columns.split("\s*,\s*");
        }
      }
      this.target.columns.forEach(col => {
          if(col.text != 'Parameters not yet gathered, select Datasource AND Datatype'){
                  this.colSegments.push(this.uiSegmentSrv.newCondition( col.text ));
                  this.colSegments.push(this.uiSegmentSrv.newSegment({ value: col.value }));
          }else {
                  this.colSegments.push(this.uiSegmentSrv.newOperator( col.text ));
          }
      });
      if(this.colSegments.length == 0) {
        //this.colSegments.push(this.uiSegmentSrv.newSegment({ value: '*' }));
      } else {
        if(this.colSegments[this.colSegments.length-1].text && this.colSegments[this.colSegments.length-1].text.match(/\(\)$/)) {
          this.colSegments.push(this.uiSegmentSrv.newSegment({ value: ' ' }));
        }
      }
      //this.colSegments.push(this.uiSegmentSrv.newPlusButton());
      //this.colSegments.push(this.uiSegmentSrv.newCondition( "executePolicy" ));
      //this.colSegments.push(this.uiSegmentSrv.newSegment({ text: 'executePolicy' , value: 'true' }));
  }
  
  //end test

  getDataSources() {
    if (this.at) {
      return Promise.resolve(this.at);
    } else {
      return this.datasource.getDataSources()
        .then(items => {
          return items.sort(function (a, b) {
            return (a.description > b.description ? 1 : -1);
          })
        });
    }
  }

  DataSources() {
    return this.getDataSources().then(items => {
      return _.map(items, item => {
        return { text: item.id, value: item.id };
      });
    });
  }

  getDataTypes() {
    let target = this.target.DataSource;
    return this.datasource.getDataTypes(target)
      .then(items => {
        return items.sort(function (a, b) {
          return (a.description > b.description ? 1 : -1);
        })
      });
  }

  DataTypes() {
    return this.getDataTypes().then(items => {
      var filtered = items.filter(item => item.notAvailableInPreFetch != true);
      return filtered.map(item => {
        return { text: item.id, value: item.id };
      })
    });
  }
 
  getFields() {
    let target = this.target.DataSource;
    let aG = this.target.DataType;
    return this.datasource.getFields(target, aG)
      .then(items => {
        return items.sort(function (a, b) {
          return (a.label > b.label ? 1 : -1);
        })
      });
  }

  Fields() {
    return this.getFields().then(items => {
      return _.map(items, item => {
        return { text: item.label, value: item.id };
      });
    });
  }

  getTimeFields() {
      let target = this.target.DataSource;
      let aG = this.target.DataType;
      var This= this;
      let TimeFields=[];
      this.target.timeAttribute=[];
      return this.datasource.getTimeFields(target, aG)
        .then(items => {
            items.forEach(OneItem=> {
              if ( OneItem.valueType=='isodatetime' ){
                  TimeFields.push (OneItem);
                  This.timeAttributes.push({ name:  OneItem.label , value: OneItem.label });
                  
              }else if ( OneItem.valueType=='datetime' ){
                  TimeFields.push (OneItem);
                  This.timeAttributes.push({ name:  OneItem.label , value: OneItem.label });
              }
            });
            This.timeAttributes.reverse();
            this.target.valueAttribute = [{ name: 'value', value: 'value' }];
            return TimeFields;
          })
    }

    TimeFields() {
      return this.getTimeFields().then(items => {
        return _.map(items, item => {
          return { text: item.label, value: item.id };
        });
      });
    }
  
  getParameters() {
      var This=this;
      let target = this.target.DataSource;
      let aG = this.target.DataType;
      
      return this.datasource.getParameters(target , aG)
          .then ( function (params) {
              This.colSegments=[];
              This.target.columns=params;
              if (params.length > 0){
              params.forEach(col => {
                  if(col.text != 'Parameters not yet gathered, select Datasource AND Datatype'){
                      This.colSegments.push(This.uiSegmentSrv.newCondition( col.text ));
                      //This.colSegments.push(This.uiSegmentSrv.newKey( col.text ));
                      //This.colSegments.push(This.uiSegmentSrv.newSegment({ value: col.text }));
                      This.colSegments.push(This.uiSegmentSrv.newKeyValue( col.text ));
                  }else {
                      This.colSegments.push(This.uiSegmentSrv.newOperator( col.text ));
                  }
              });
          }else{
              This.colSegments.push(This.uiSegmentSrv.newOperator( 'Policy has no Input Parameter defined use Condition below..' ));
          }
              //console.log(params ,"==>" , typeof(params));
              return ;
          })
          .then(function(){
//              This.setColSegments();
               This.onChangeInternal();
          });
  };
  
  
  getPrimaryKey() {
    let target = this.target.DataSource;
    let aG = this.target.DataType;
    if (target=="") {
        return [];
    }
    return this.datasource.getPrimaryKey(target, aG).then(items => {
      this.pk = items.sort(function (a, b) {
        return (a.label > b.label ? 1 : -1);
      });
      return items;
    });
  }

  PrimaryKey() {
    return this.getPrimaryKey().then(items => {
      return _.map(items, item => {
        return { text: item.label, value: item.id };
      });
    });
  }

  onChangeDataSource() {
    this.target.datatype=null;
    this.refresh();
  }
  
  onChangeFields() {
    this.showPrimaryKey = true;
    this.refresh();
  }
  
  onChangeInternal() {
      this.showPrimaryKey = true;
    this.refresh();
  }
  
  onChangeDataType() {
      this.getParameters();
      this.getTimeFields();
      this.refresh();
    }


  onChangeParameters() {
    console.log(this.target.columns);
    Promise.resolve(this.target.columns);
  };
}
export { IPMQueryCtrl };