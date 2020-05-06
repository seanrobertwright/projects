/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./SelectionPlugin","./SelectionModelSelection","./BindingSelection","../library","../utils/TableUtils","sap/ui/core/Icon","sap/ui/core/IconPool","sap/base/Log"],function(S,a,B,l,T,I,b,L){"use strict";var c=l.SelectionMode;var M=S.extend("sap.ui.table.plugins.MultiSelectionPlugin",{metadata:{properties:{limit:{type:"int",group:"Behavior",defaultValue:200},enableNotification:{type:"boolean",group:"Behavior",defaultValue:false},showHeaderSelector:{type:"boolean",group:"Appearance",defaultValue:true},selectionMode:{type:"sap.ui.table.SelectionMode",group:"Behavior",defaultValue:c.MultiToggle}},events:{selectionChange:{parameters:{indices:{type:"int[]"},limitReached:{type:"boolean"},customPayload:{type:"object"}}}}}});M.prototype.init=function(){S.prototype.init.apply(this,arguments);var i=new I({src:b.getIconURI(T.ThemeParameters.resetIcon),useIconTooltip:false});i.addStyleClass("sapUiTableSelectClear");this._bLimitReached=false;this._bLimitDisabled=this.getLimit()===0;this.oInnerSelectionPlugin=null;this.oDeselectAllIcon=i;this._oNotificationPopover=null;};M.prototype.exit=function(){if(this.oDeselectAllIcon){this.oDeselectAllIcon.destroy();this.oDeselectAllIcon=null;}if(this._oNotificationPopover){this._oNotificationPopover.destroy();this._oNotificationPopover=null;}};M.prototype.onActivate=function(o){S.prototype.onActivate.apply(this,arguments);this.oInnerSelectionPlugin=o._createLegacySelectionPlugin();this.oInnerSelectionPlugin.attachSelectionChange(this._onSelectionChange,this);o.addAggregation("_hiddenDependents",this.oInnerSelectionPlugin);o.setProperty("selectionMode",this.getSelectionMode());};M.prototype.onDeactivate=function(o){S.prototype.onDeactivate.apply(this,arguments);o.detachFirstVisibleRowChanged(this.onFirstVisibleRowChange,this);if(this._oNotificationPopover){this._oNotificationPopover.close();}if(this.oInnerSelectionPlugin){this.oInnerSelectionPlugin.destroy();this.oInnerSelectionPlugin=null;}};M.prototype.getRenderConfig=function(){return{headerSelector:{type:this._bLimitDisabled?"toggle":"clear",icon:this.oDeselectAllIcon,visible:this.getSelectionMode()===c.MultiToggle&&this.getShowHeaderSelector(),enabled:this._bLimitDisabled||this.getSelectedCount()>0}};};M.prototype.onHeaderSelectorPress=function(){var r=this.getRenderConfig();if(!r.headerSelector.visible||!r.headerSelector.enabled){return;}if(r.headerSelector.type==="toggle"){t(this);}else if(r.headerSelector.type==="clear"){this.clearSelection();}};M.prototype.onKeyboardShortcut=function(s){if(s==="toggle"){if(this._bLimitDisabled){t(this);}}else if(s==="clear"){this.clearSelection();}};function t(P){if(P.getSelectableCount()>P.getSelectedCount()){P.selectAll();}else{P.clearSelection();}}M.prototype.setSelectionMode=function(s){var o=this.getSelectionMode();var f=this.getParent();if(f){f.setProperty("selectionMode",s,true);}this.setProperty("selectionMode",s);if(this.getSelectionMode()!==o){this.clearSelection();}return this;};M.prototype.setLimit=function(i){if(typeof i==="number"&&i<0){L.warning("The limit must be greater than or equal to 0",this);return this;}this.setProperty("limit",i,!!this.getLimit()===!!i);this._bLimitDisabled=i===0;return this;};M.prototype.setEnableNotification=function(n){this.setProperty("enableNotification",n,true);return this;};M.prototype.isLimitReached=function(){return this._bLimitReached;};M.prototype.setLimitReached=function(f){this._bLimitReached=f;};M.prototype.selectAll=function(E){if(!this._bLimitDisabled){return Promise.reject(new Error("Not possible if the limit is enabled"));}var s=this.getSelectableCount();if(s===0){return Promise.reject(new Error("Nothing to select"));}return this.addSelectionInterval(0,s-1,E);};function p(P,i,f,A){var h=P._getHighestSelectableIndex();if(i<0&&f<0||i>h&&f>h){return Promise.reject(new Error("Out of range"));}i=Math.min(Math.max(0,i),h);f=Math.min(Math.max(0,f),h);var g=P.getLimit();var r=f<i;var G=r?f:i;var j;if(A&&P.isIndexSelected(i)){if(r){i--;}else if(i!==f){i++;G++;}}j=Math.abs(f-i)+1;if(!P._bLimitDisabled){P.setLimitReached(j>g);if(P.isLimitReached()){if(r){f=i-g+1;}else{f=i+g-1;}j=g+1;}}return d(P.getTableBinding(),G,j).then(function(){return{indexFrom:i,indexTo:f};});}M.prototype.setSelectionInterval=function(i,f,E){var s=this.getSelectionMode();if(s===c.None){return Promise.reject(new Error("SelectionMode is '"+c.None+"'"));}if(s===c.Single){i=f;}return p(this,i,f,false).then(function(m){this._oCustomEventPayloadTmp=E;this.oInnerSelectionPlugin.setSelectionInterval(m.indexFrom,m.indexTo);delete this._oCustomEventPayloadTmp;return this._scrollTableToIndex(m.indexTo,m.indexFrom>m.indexTo);}.bind(this));};M.prototype.setSelectedIndex=function(i,E){return this.setSelectionInterval(i,i,E);};M.prototype.addSelectionInterval=function(i,f,E){var s=this.getSelectionMode();if(s===c.None){return Promise.reject(new Error("SelectionMode is '"+c.None+"'"));}if(s===c.Single){return this.setSelectionInterval(f,f);}if(s===c.MultiToggle){return p(this,i,f,true).then(function(m){this._oCustomEventPayloadTmp=E;this.oInnerSelectionPlugin.addSelectionInterval(m.indexFrom,m.indexTo);delete this._oCustomEventPayloadTmp;return this._scrollTableToIndex(m.indexTo,m.indexFrom>m.indexTo);}.bind(this));}};M.prototype._scrollTableToIndex=function(i,r){var o=this.getParent();if(!o||!this.isLimitReached()){return Promise.resolve();}var f=o.getFirstVisibleRow();var R=o._getRowCounts();var g=f+R.scrollable-1;var E=false;if(i<f||i>g){var n=r?i-R.fixedTop-1:i-R.scrollable-R.fixedTop+2;E=o._setFirstVisibleRowIndex(Math.max(0,n));}this._showNotificationPopoverAtIndex(i);return new Promise(function(h){if(E){o.attachEventOnce("_rowsUpdated",h);}else{h();}});};M.prototype._showNotificationPopoverAtIndex=function(i){var f=this;var P=this._oNotificationPopover;var o=this.getParent();var r=o.getRows()[i-o._getFirstRenderedRowIndex()];var s=T.getResourceText("TBL_SELECT_LIMIT_TITLE");var m=T.getResourceText("TBL_SELECT_LIMIT",[this.getLimit()]);if(!this.getEnableNotification()){return Promise.resolve();}return new Promise(function(g){sap.ui.require(["sap/m/Popover","sap/m/Bar","sap/m/Title","sap/m/Text","sap/m/HBox","sap/ui/core/library","sap/m/library"],function(h,j,k,n,H,q,u){if(!P){P=new h(f.getId()+"-notificationPopover",{customHeader:[new j({contentMiddle:[new H({items:[new I({src:"sap-icon://message-warning",color:q.IconColor.Critical}).addStyleClass("sapUiTinyMarginEnd"),new k({text:s,level:q.TitleLevel.H2})],renderType:u.FlexRendertype.Bare,justifyContent:u.FlexJustifyContent.Center,alignItems:u.FlexAlignItems.Center})]})],content:new n({text:m})});P.addStyleClass("sapUiContentPadding");f._oNotificationPopover=P;}else{P.getContent()[0].setText(m);}o.detachFirstVisibleRowChanged(f.onFirstVisibleRowChange,f);o.attachFirstVisibleRowChanged(f.onFirstVisibleRowChange,f);var R=r.getDomRefs().rowSelector;if(R){P.openBy(R);}g();});});};M.prototype.onFirstVisibleRowChange=function(){if(!this._oNotificationPopover){return;}var o=this.getParent();if(o){o.detachFirstVisibleRowChanged(this.onFirstVisibleRowChange,this);}this._oNotificationPopover.close();};function d(o,s,i){return new Promise(function(r){e(o,s,i,r);});}function e(o,s,f,r){var C=o.getContexts(s,f);var g=false;for(var i=0;i<C.length;i++){if(!C[i]){g=true;break;}}if(!g&&!C.dataRequested){r(C);return;}o.attachEventOnce("dataReceived",function(){if(C.length==f){r(C);}else{e(o,s,f,r);}});}M.prototype.clearSelection=function(E){if(this.oInnerSelectionPlugin){this.setLimitReached(false);this._oCustomEventPayloadTmp=E;this.oInnerSelectionPlugin.clearSelection();delete this._oCustomEventPayloadTmp;}};M.prototype.getSelectedIndex=function(){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.getSelectedIndex();}return-1;};M.prototype.getSelectedIndices=function(){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.getSelectedIndices();}return[];};M.prototype.getSelectableCount=function(){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.getSelectableCount();}return 0;};M.prototype.getSelectedCount=function(){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.getSelectedCount();}return 0;};M.prototype.isIndexSelectable=function(i){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.isIndexSelectable(i);}return false;};M.prototype.isIndexSelected=function(i){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin.isIndexSelected(i);}return false;};M.prototype.removeSelectionInterval=function(i,f,E){if(this.oInnerSelectionPlugin){this.setLimitReached(false);this._oCustomEventPayloadTmp=E;this.oInnerSelectionPlugin.removeSelectionInterval(i,f);delete this._oCustomEventPayloadTmp;}};M.prototype._onSelectionChange=function(E){var r=E.getParameter("rowIndices");this.fireSelectionChange({rowIndices:r,limitReached:this.isLimitReached(),customPayload:typeof this._oCustomEventPayloadTmp==="object"?this._oCustomEventPayloadTmp:null});};M.prototype._getHighestSelectableIndex=function(){if(this.oInnerSelectionPlugin){return this.oInnerSelectionPlugin._getHighestSelectableIndex();}return 0;};M.prototype.onThemeChanged=function(){this.oDeselectAllIcon.setSrc(b.getIconURI(T.ThemeParameters.resetIcon));};return M;});
