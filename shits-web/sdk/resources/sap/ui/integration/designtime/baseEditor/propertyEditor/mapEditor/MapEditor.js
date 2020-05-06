/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/base/util/deepClone","sap/ui/model/json/JSONModel","sap/base/util/restricted/_merge","sap/base/util/restricted/_omit","sap/base/util/isPlainObject","sap/base/util/includes"],function(B,d,J,_,a,i,b){"use strict";var S={"string":"BASE_EDITOR.MAP.TYPES.STRING","boolean":"BASE_EDITOR.MAP.TYPES.BOOLEAN","number":"BASE_EDITOR.MAP.TYPES.NUMBER","integer":"BASE_EDITOR.MAP.TYPES.INTEGER","date":"BASE_EDITOR.MAP.TYPES.DATE","datetime":"BASE_EDITOR.MAP.TYPES.DATETIME"};var M=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor",init:function(){this._itemsModel=new J();this._itemsModel.setDefaultBindingMode("OneWay");this.setModel(this._itemsModel,"itemsModel");this._supportedTypesModel=new J();this._supportedTypesModel.setDefaultBindingMode("OneWay");this.setModel(this._supportedTypesModel,"supportedTypes");this.attachModelContextChange(function(){if(this.getModel("i18n")){var r=this.getModel("i18n").getResourceBundle();this._aSupportedTypes=Object.keys(S).map(function(k){return{key:k,label:r.getText(S[k])};});this._setSupportedTypesModel();}},this);this.attachConfigChange(this._setSupportedTypesModel,this);this._mTypes={};},setValue:function(v){v=i(v)?v:{};var I=this._processValue(v);this._itemsModel.setData(I);B.prototype.setValue.call(this,v);},_processValue:function(v){return Object.keys(v).map(function(k){var f=this.formatInputValue(d(v[k]),k);if(!f.type){f.type=this._mTypes[k]||this._getDefaultType(f.value);}this._mTypes[k]=f.type;f.path=k;var I={key:k,value:[f]};return this.getConfig().includeInvalidEntries!==false||this._isValidItem(I,d(v[k]))?I:undefined;},this).filter(Boolean);},_isValidItem:function(I){var t=I.value[0].type;return t&&b(this._getAllowedTypes(),t);},_getDefaultType:function(v){var A=this._getAllowedTypes();var t=typeof v;var c=b(A,t)?t:undefined;if(!c&&b(A,"string")){c="string";}return c;},_getAllowedTypes:function(){var c=this.getConfig();return c&&c["allowedTypes"]||["string"];},_setSupportedTypesModel:function(){var A=this._getAllowedTypes();this._supportedTypesModel.setData(this._aSupportedTypes.filter(function(s){return b(A,s.key);}));},getExpectedWrapperCount:function(v){return this._processValue(v).length;},formatInputValue:function(v){return{value:v};},formatOutputValue:function(v){return v.value;},_onRemoveElement:function(e){var k=e.getSource().getBindingContext("itemsModel").getObject().key;var v=this.getValue();this.setValue(a(v,k));},_onAddElement:function(){var p=_({},this.getValue());var k=this._getUniqueKey(p);p[k]=this.formatOutputValue({value:"",type:"string"});this.setValue(p);},_getUniqueKey:function(p){var k="key";var I=0;while(p.hasOwnProperty(k)){k="key"+ ++I;}return k;},_onKeyChange:function(e){var I=(this._itemsModel.getData()||[]).slice();var o=e.getSource();var n=e.getParameter("value");var O=o.getBindingContext("itemsModel").getObject().key;var c=I.map(function(f){return f.key;});var v=this.getValue();var E=c.indexOf(O);if(E>=0&&(!v.hasOwnProperty(n)||n===O)){o.setValueState("None");var f=d(I[E]);f.key=n;I.splice(E,1,f);if(n!==O){var m={};I.forEach(function(f){m[f.key]=this.formatOutputValue({value:f.value[0].value,type:f.value[0].type});},this);this._mTypes[n]=this._mTypes[O];delete this._mTypes[O];this.setValue(m);}}else{o.setValueState("Error");o.setValueStateText(this.getI18nProperty("BASE_EDITOR.MAP.DUPLICATE_KEY"));}},_onTypeChange:function(e,k){var E=_({},this.getValue());var n=e.getParameter("selectedItem").getKey();var I=this.formatInputValue(E[k]);I.type=n;E[k]=this.formatOutputValue(I);this._mTypes[k]=n;this.setValue(E);},_propertyEditorsChange:function(e){var p=e.getParameter("previousPropertyEditors")[0];var P=e.getParameter("propertyEditors")[0];if(p){p.detachValueChange(this._onPropertyValueChange,this);}if(P){P.attachValueChange(this._onPropertyValueChange,this);}},_onPropertyValueChange:function(e){var E=_({},this.getValue());var k=e.getParameter("path");var I=this.formatInputValue(E[k]);I.value=e.getParameter("value");E[k]=this.formatOutputValue(I);this.setValue(E);},renderer:B.getMetadata().getRenderer().render});return M;});
