/*!
 # * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./library','sap/ui/core/Control','sap/ui/core/Popup','sap/ui/core/delegate/ItemNavigation','./ToolbarRenderer','sap/base/assert','sap/ui/dom/containsOrEquals','sap/ui/core/ResizeHandler','sap/ui/core/Element','sap/ui/events/KeyCodes'],function(q,l,C,P,I,T,a,c,R,E,K){"use strict";var b=l.ToolbarDesign;var d=C.extend("sap.ui.commons.Toolbar",{metadata:{interfaces:["sap.ui.core.Toolbar"],library:"sap.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},design:{type:"sap.ui.commons.ToolbarDesign",group:"Appearance",defaultValue:b.Flat},standalone:{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.commons.ToolbarItem",multiple:true,singularName:"item"},rightItems:{type:"sap.ui.commons.ToolbarItem",multiple:true,singularName:"rightItem"}}}});d.prototype.init=function(){this.bOpen=false;this.oDomRef=null;this.oInnerRef=null;this.oOverflowDomRef=null;this._oOverflowPopup=null;this.sOriginalStylePropertyWidth=null;this.bHasRightItems=false;this._bRendering=false;this.bRtl=sap.ui.getCore().getConfiguration().getRTL();this._detectVisibleItemCountChangeTimer=null;var t=this;this.oItemDelegate={onAfterRendering:q.proxy(t._itemRendered,t)};this.data("sap-ui-fastnavgroup","true",true);};d.prototype.onBeforeRendering=function(){T.emptyOverflowPopup(this,false);this.cleanup();this.$("mn").unbind("keydown",this._handleKeyDown);this.bFirstTime=true;this._bRendering=true;};d.prototype.onAfterRendering=function(){this._bRendering=false;this.oDomRef=this.getDomRef();this.oInnerRef=this.oDomRef.firstChild.firstChild;q(this.oInnerRef).css("visibility","visible");this.oOverflowDomRef=this.getDomRef("mn");if(!this.oItemNavigation){this.oItemNavigation=new I();this.addDelegate(this.oItemNavigation);}this.$("mn").bind("keydown",q.proxy(this._handleKeyDown,this));this.sResizeListenerId=R.register(this.oDomRef,q.proxy(this.ontoolbarresize,this));var i=this.getRightItems().length;this.bHasRightItems=i>0;if(this.bHasRightItems){this.sRightSideResizeListenerId=R.register(this.oDomRef.lastChild,q.proxy(this.onrightsideresize,this));this.updateAfterResize(true);this._observeVisibleItemCountChange(40);}else{this.updateAfterResize(true);this._observeVisibleItemCountChange(350);}};d.prototype._handleKeyDown=function(o){if((o.keyCode==K.SPACE)&&(o.target.id===this.getId()+"-mn")){this.handleOverflowButtonTriggered();o.preventDefault();o.stopPropagation();}};d.prototype.exit=function(){this.cleanup();if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}this.oItemDelegate=undefined;q(window).unbind("resize",this.onwindowresize);r.call(this);};d.prototype.updateAfterResize=function(i){if(this._bRendering){return;}var v=this.getVisibleItemInfo();this._oLastVisibleItem=v.oLastVisibleItem;this._oFirstInvisibleItem=v.oFirstInvisibleItem;this._iLastVisibleItemTop=v.iLastVisibleItemTop;this.updateItemNavigation(v.iAllItemsBeforeBreak,i);this.updateOverflowIcon(v.bOverflow);if(this.sUpdateItemNavigationTimer){clearTimeout(this.sUpdateItemNavigationTimer);this.sUpdateItemNavigationTimer=null;}};d.prototype._detectVisibleItemCountChange=function(){if(!this.getDomRef()){if(this._detectVisibleItemCountChangeTimer){clearTimeout(this._detectVisibleItemCountChangeTimer);this._detectVisibleItemCountChangeTimer=null;}return;}if(this._oLastVisibleItem&&this._oFirstInvisibleItem){var i=this._oLastVisibleItem.offsetLeft;var j=this._oFirstInvisibleItem.offsetLeft;var k=this._oLastVisibleItem.offsetTop;var m=this.bRtl?(j<i):(j>i);if((k!=this._iLastVisibleItemTop)||(!this.bOpen&&m)){if(this.bOpen){this.closePopup(true);}this.updateAfterResize(false);}}else if(this._oLastVisibleItem&&!this._oFirstInvisibleItem){if(this._oLastVisibleItem.offsetTop!=this._iLastVisibleItemTop){this.updateAfterResize(false);}}this._observeVisibleItemCountChange(350);if(this.bFirstTime&&this.bHasRightItems){this.onrightsideresize();this.bFirstTime=false;}};d.prototype._observeVisibleItemCountChange=function(i){this._detectVisibleItemCountChangeTimer=setTimeout(function(){this._detectVisibleItemCountChange();}.bind(this),i);};d.prototype.updateItemNavigation=function(A,j){this.oItemNavigation.setRootDomRef(this.oDomRef);var L=g.call(this);var k=[];for(var i=0;i<A;i++){var D=L[i].getFocusDomRef();if(D){k.push(D);}}k.push(this.oOverflowDomRef);this.iLeftItemDomRefCount=k.length;var m=this.getRightItems();for(var i=0;i<m.length;i++){var D=m[i].getFocusDomRef();if(D){k.push(D);}}this.oItemNavigation.setItemDomRefs(k);this.iItemDomRefCount=k.length;if(j){for(var i=A;i<L.length;i++){var D=L[i].getFocusDomRef();var $=q(D);if(D&&($.attr("tabindex")=="0")){$.attr("tabIndex",-1);}}}};d.prototype.getVisibleItemInfo=function(j){var v=0;if(this.oInnerRef){var k=j?this.oInnerRef.childNodes:this.oInnerRef.parentNode.querySelectorAll("#"+this.oInnerRef.id+' > :not(.sapUiHiddenPlaceholder)');this.bRtl=sap.ui.getCore().getConfiguration().getRTL();var L,o,m=0,n,p,s=0,t=null,F=null,u,A,O=false;for(var i=1,w=k.length;i<w;i++){o=k[i];n=o.offsetLeft;if(i==1){p=k[0].offsetWidth;s=k[0].offsetLeft;}if(this.bRtl){m=o.offsetWidth;L=!f.call(this,o)&&(n+m>=s+p);}else{L=!f.call(this,o)&&(n<=s)&&(o.offsetTop>k[0].offsetTop);}if(L){v=i;t=k[i-1];F=o;u=t.offsetTop;O=true;break;}else if(f.call(this,o)){v=i;a(v===(w-1),"visible items ("+v+") must be one less than the items count ("+w+")");t=k[i-1];F=null;u=t.offsetTop;O=false;break;}else{s=n;p=m;}}A=h.call(this,t);}return{"count":v,"oLastVisibleItem":t,"oFirstInvisibleItem":F,"iLastVisibleItemTop":u,"iAllItemsBeforeBreak":A,"bOverflow":O};};d.prototype.updateOverflowIcon=function(o){this.oOverflowDomRef.style.display=o||this.bOpen?"block":"none";};d.prototype.onclick=function(o){if(o.target.id===this.getId()+"-mn"){this.handleOverflowButtonTriggered();o.preventDefault();o.stopPropagation();}};d.prototype.onsapdown=function(o){if(o.target.id===this.getId()+"-mn"){if(!this.bOpen){this.handleOverflowButtonTriggered();o.preventDefault();o.stopImmediatePropagation();}}};d.prototype.onsapup=function(o){if(o.target.id===this.getId()+"-mn"){if(this.bOpen){this.handleOverflowButtonTriggered();o.preventDefault();o.stopPropagation();}}};d.prototype.handleOverflowButtonTriggered=function(){if(!this.bPopupInitialized){this._oOverflowPopup=new e(this);this.popup=new P(this._oOverflowPopup,false,true,true);this.popup.setAutoCloseAreas([this.getId()+"-mn"]);this.bPopupInitialized=true;}if(this.bOpen){this.closePopup(false);}else{this.openPopup();}};d.prototype.openPopup=function(){this.getRenderer().setActive(this);var D=q(this.getDomRef());this.sOriginalStylePropertyWidth=D.prop('style').width;D.width(D.width());T.fillOverflowPopup(this);this.popup.attachEvent("opened",this.handlePopupOpened,this);this.popup.attachEvent("closed",this.handlePopupClosed,this);q(window).bind("resize",q.proxy(this.onwindowresize,this));var i=0;this.popup.open(i,P.Dock.EndTop,P.Dock.EndBottom,this.$("mn"),"","fit",true);};d.prototype.handlePopupOpened=function(){var L=g.call(this);var A=this.getVisibleItemInfo().iAllItemsBeforeBreak;this.bOpen=true;var n=[];for(var i=A;i<L.length;i++){var D=L[i].getFocusDomRef();if(D){n.push(D);}}this.popup.getContent().initItemNavigation(n);};d.prototype.closePopup=function(i){this._bResetFocus=i;this.popup.close();q(window).unbind("resize",this.onwindowresize);};d.prototype.handlePopupClosed=function(){this.getRenderer().unsetActive(this);this.bOpen=false;T.emptyOverflowPopup(this);var A=this.getVisibleItemInfo().iAllItemsBeforeBreak;this.updateItemNavigation(A,true);if(this._bResetFocus){this.oItemNavigation.focusItem(this.iLeftItemDomRefCount-1);}this._bResetFocus=false;};d.prototype.prepareFocusInfoRedirect=function(o){if(o&&!o._orig_getFocusInfo){var i=this.getId();o._orig_getFocusInfo=o.getFocusInfo;o.getFocusInfo=function(){return{id:i,childInfo:this._orig_getFocusInfo()};};var t=this;o._orig_applyFocusInfo=o.applyFocusInfo;o.applyFocusInfo=function(F){return t.applyFocusInfo(F.childInfo);};}return o;};d.prototype.cleanupFocusInfoRedirect=function(o){if(o){o.getFocusInfo=o._orig_getFocusInfo;delete o._orig_getFocusInfo;delete o._orig_applyFocusInfo;}return o;};d.prototype.insertItem=function(i,j){this.insertAggregation("items",this.prepareFocusInfoRedirect(i),j);i.addDelegate(this.oItemDelegate);return this;};d.prototype.addItem=function(i){this.addAggregation("items",this.prepareFocusInfoRedirect(i));i.addDelegate(this.oItemDelegate);return this;};d.prototype.removeItem=function(v){var t=this.removeAggregation("items",v);t.removeDelegate(this.oItemDelegate);return this.cleanupFocusInfoRedirect(t);};d.prototype.removeAllItems=function(){var t=this.removeAllAggregation("items");for(var i=0,L=t.length;i<L;i++){t[i]=this.cleanupFocusInfoRedirect(t[i]);t[i].removeDelegate(this.oItemDelegate);}return t;};d.prototype.insertRightItem=function(i,j){this.insertAggregation("rightItems",this.prepareFocusInfoRedirect(i),j);i.addDelegate(this.oItemDelegate);return this;};d.prototype.addRightItem=function(i){this.addAggregation("rightItems",this.prepareFocusInfoRedirect(i));i.addDelegate(this.oItemDelegate);return this;};d.prototype.removeRightItem=function(v){var t=this.removeAggregation("rightItems",v);t.removeDelegate(this.oItemDelegate);return this.cleanupFocusInfoRedirect(t);};d.prototype.removeAllRightItems=function(){var t=this.removeAllAggregation("rightItems");for(var i=0,L=t.length;i<L;i++){t[i]=this.cleanupFocusInfoRedirect(t[i]);t[i].removeDelegate(this.oItemDelegate);}return t;};d.prototype.getFocusInfo=function(){var i=this.getId();if(this.bOpen){return{id:i,childId:i};}else{return{id:i};}};d.prototype.applyFocusInfo=function(F){if(F){var s=F.childId;if(this.bOpen&&s){if(s===this.getId()){return;}var o=sap.ui.getCore().byId(s);var i;if(o&&this.popup&&(i=this.popup.getContent())&&c(i.getDomRef(),o.getDomRef())){i.applyFocusInfo(F.childInfo);return;}}}this.focus();};var e=E.extend("sap.ui.commons.ToolbarOverflowPopup",{constructor:function(t){this.oToolbar=t;var i=t.getId()+"-pu";E.call(this,i);},exit:function(){this.$().remove();},initItemNavigation:function(n){if(!this.oItemNavigation){this.oItemNavigation=new I();this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(T.getPopupArea(this.oToolbar));this.oItemNavigation.setItemDomRefs(n);this.oItemNavigation.focusItem(0);},getDomRef:function(){var p=T.getPopupArea(this.oToolbar);if(p){return p.parentNode;}else{return null;}},isActive:function(){return T.getPopupArea(this.oToolbar)!=null;},onsapescape:function(o){this.oToolbar.closePopup(true);},onsaptabnext:function(o){this.oToolbar.closePopup(true);o.preventDefault();o.stopPropagation();},onsaptabprevious:function(o){this.oToolbar.closePopup(true);o.preventDefault();o.stopPropagation();}});d.prototype._itemRendered=function(){if(this.oItemNavigation){this.updateAfterResize(true);}else{if(!this.sUpdateItemNavigationTimer){this.sUpdateItemNavigationTimer=setTimeout(function(){this.updateAfterResize(true);}.bind(this),0);}}};d.prototype.onwindowresize=function(o){if(this.bOpen){this.closePopup(true);}};d.prototype.ontoolbarresize=function(o){if(this.bOpen){this.closePopup(true);}};d.prototype.onrightsideresize=function(){if(!this.getDomRef()){this.cleanup();return;}if(this.getRightItems().length>0){var o=this.oDomRef.lastChild;var i=o.offsetWidth;if(this.bRtl){q(this.oInnerRef).css("margin-left",(i+10)+"px");}else{q(this.oInnerRef).css("margin-right",(i+10)+"px");}var F=this.oDomRef.firstChild.firstChild.firstChild;var O=this.getDomRef("mn").offsetWidth;var m=F.offsetWidth+i+O+20;q(this.oDomRef).css("min-width",m+"px");q(this.oInnerRef).css("visibility","visible");}};d.prototype.cleanup=function(){if(this._detectVisibleItemCountChangeTimer){clearTimeout(this._detectVisibleItemCountChangeTimer);this._detectVisibleItemCountChangeTimer=null;}if(this.sUpdateItemNavigationTimer){clearTimeout(this.sUpdateItemNavigationTimer);this.sUpdateItemNavigationTimer=null;}if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}if(this.sRightSideResizeListenerId){R.deregister(this.sRightSideResizeListenerId);this.sRightSideResizeListenerId=null;}};function g(){var i=[];this.getItems().forEach(function(j){if(j instanceof sap.ui.commons.ToolbarSeparator||j.getVisible()){i.push(j);}});return i;}function f(o){var O=this.getId()+"-mn";return o.id===O;}function h(L){var A=0;var j=g.call(this);j.forEach(function(k,i){if(k.getDomRef()===L){A=i+1;return false;}});return A;}return d;function r(){if(this.bPopupInitialized){this._oOverflowPopup.destroy();this._oOverflowPopup=null;this.popup.detachOpened(this.handlePopupOpened,this);this.popup.detachClosed(this.handlePopupClosed,this);this.popup.destroy();this.popup=null;this.bPopupInitialized=false;}}});
