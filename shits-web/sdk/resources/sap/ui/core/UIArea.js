/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','./Element','./RenderManager','sap/ui/performance/trace/Interaction',"sap/ui/dom/containsOrEquals","sap/ui/util/ActivityDetection","sap/ui/events/KeyCodes","sap/base/Log","sap/base/assert","sap/ui/performance/Measurement",'sap/ui/events/jquery/EventExtension',"sap/ui/events/ControlEvents","sap/ui/events/F6Navigation","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control"],function(M,E,R,I,c,A,K,L,a,b,d,C,F,q){"use strict";d.apply();q(document).on("keydown",function(e){F.handleF6GroupNavigation(e,null);});var r=L.getLogger("sap.ui.Rendering",((window["sap-ui-config"]&&(window["sap-ui-config"]["xx-debugRendering"]||window["sap-ui-config"]["xx-debugrendering"]))||/sap-ui-xx-debug(R|-r)endering=(true|x|X)/.test(document.location.search))?L.Level.DEBUG:Math.min(L.Level.INFO,L.getLevel())),D=function(o){return o;},f=function(){},g=function(){};if(r.isLoggable()){D=function(o){var l;try{throw new Error();}catch(e){l=e.stack||e.stacktrace||(e.sourceURL?e.sourceURL+":"+e.line:null);l=l?l.split(/\n\s*/g).slice(2):undefined;}return{obj:o,location:l};};f=function(t,m){var o=sap.ui.getCore(),e={},n,i;for(n in m){i=o.byId(n);e[n]={type:i?i.getMetadata().getName():(m[n].obj===t?"UIArea":"(no such control)"),location:m[n].location,reason:m[n].reason};}r.debug("  UIArea '"+t.getId()+"', pending updates: "+JSON.stringify(e,null,"\t"));};g=function(B,m){var n;for(n in m){if(B[n]!=null){if(B[n].obj!==m[n].obj){m[n].reason="replaced during rendering";}else{m[n].reason="invalidated again during rendering";}}else{m[n].reason="invalidated during rendering";}}};}var U=M.extend("sap.ui.core.UIArea",{constructor:function(o,e){if(arguments.length===0){return;}M.apply(this);this.oCore=o;this.bLocked=false;this.bInitial=true;this.aContentToRemove=[];this.bNeedsRerendering=false;if(e!=null){this.setRootNode(e);this.bNeedsRerendering=this.bNeedsRerendering&&!((e.id+"-Init"?window.document.getElementById(e.id+"-Init"):null));}this.mInvalidatedControls={};if(!this.bNeedsRerendering){this.bRenderSelf=false;}else{this.oCore.addInvalidatedUIArea(this);}},metadata:{publicMethods:["setRootNode","getRootNode","setRootControl","getRootControl","lock","unlock","isLocked"],aggregations:{content:{name:"content",type:"sap.ui.core.Control",multiple:true,singularName:"content"},dependents:{name:"dependents",type:"sap.ui.core.Control",multiple:true}}}});U.prototype.isInvalidateSuppressed=function(){return this.iSuppressInvalidate>0;};U.prototype.getId=function(){return this.oRootNode?this.oRootNode.id:null;};U.prototype.getUIArea=function(){return this;};U.prototype.setRootNode=function(o){if(this.oRootNode===o){return;}a(!o||(o.nodeType===1&&!q(o).attr("data-sap-ui-area")),"UIArea root node must be a DOMElement");if(this.oRootNode){this._ondetach();}this.oRootNode=o;if(this.getContent().length>0){this.invalidate();}if(this.oRootNode){this._onattach();}};U.prototype.getRootNode=function(){return this.oRootNode;};U.prototype.setRootControl=function(o){this.removeAllContent();this.addContent(o);};U.prototype.getRootControl=function(i){var e=this.getContent();if(e.length>0){if(i>=0&&i<e.length){return e[i];}return e[0];}return null;};U.prototype._addRemovedContent=function(o){if(this.oRootNode&&o){this.aContentToRemove.push(o);}};U.prototype.addContent=function(o,_){this.addAggregation("content",o,_);if(_!==true){this.invalidate();}return this;};U.prototype.removeContent=function(e,_){var o=this.removeAggregation("content",e,_);if(!_){var i;if(o&&o.getDomRef){i=o.getDomRef();}this._addRemovedContent(i);}return o;};U.prototype.removeAllContent=function(){var e=this.removeAllAggregation("content");for(var i=0;i<e.length;i++){var o;var j=e[i];if(j&&j.getDomRef){o=j.getDomRef();}this._addRemovedContent(o);}return e;};U.prototype.destroyContent=function(){var e=this.getContent();for(var i=0;i<e.length;i++){var o;var j=e[i];if(j&&j.getDomRef){o=j.getDomRef();}this._addRemovedContent(o);}this.destroyAggregation("content");return this;};U.prototype.lock=function(){this.bLocked=true;};U.prototype.unlock=function(){if(this.bLocked&&this.bNeedsRerendering){this.oCore.addInvalidatedUIArea(this);}this.bLocked=false;};U.prototype.isLocked=function(){return this.bLocked;};U.prototype.getBindingContext=function(){return null;};U.prototype.getEventingParent=function(){return this.oCore._getEventProvider();};U.prototype.isActive=function(){return((this.getId()?window.document.getElementById(this.getId()):null))!=null;};U.prototype.invalidate=function(){this.addInvalidatedControl(this);};U.prototype.addInvalidatedControl=function(o){if(this.bRenderSelf){return;}if(!this.bNeedsRerendering){this.oCore.addInvalidatedUIArea(this);}var i=o.getId();if(o===this){this.bRenderSelf=true;this.bNeedsRerendering=true;this.mInvalidatedControls={};this.mInvalidatedControls[i]=D(this);return;}if(this.mInvalidatedControls[i]){return;}if(!this.bRenderSelf){this.mInvalidatedControls[i]=D(o);this.bNeedsRerendering=true;}};U.prototype.rerender=function(j){var t=this;function k(){t.bRenderSelf=false;t.aContentToRemove=[];t.mInvalidatedControls={};t.bNeedsRerendering=false;}function l(){try{return document.activeElement;}catch(J){}}if(j){this.bNeedsRerendering=true;}if(this.bLocked||!this.bNeedsRerendering){return false;}var m=this.bRenderSelf,o=this.aContentToRemove,s=this.mInvalidatedControls,u=false;k();b.pause("renderPendingUIUpdates");b.start(this.getId()+"---rerender","Rerendering of "+this.getMetadata().getName());f(this,s);if(m){if(this.oRootNode){r.debug("Full Rendering of UIArea '"+this.getId()+"'");R.preserveContent(this.oRootNode,false,this.bInitial);this.bInitial=false;var w=function(J,N){var z=J.length;var O;for(var i=0;i<z;i++){O=N?J[i].getDomRef():J[i];if(O&&!R.isPreservedContent(O)&&t.oRootNode===O.parentNode){q(O).remove();}}return z;};var x=l();var S=this.oCore.oFocusHandler.getControlFocusInfo();w(o);var y=this.getContent();var z=w(y,true);var B=l();for(var i=0;i<z;i++){if(y[i]&&y[i].getParent()===this){this.oCore.oRenderManager.render(y[i],this.oRootNode,true);}}u=true;if(x&&x!=B&&B===l()){try{this.oCore.oFocusHandler.restoreFocus(S);}catch(e){L.warning("Problems while restoring the focus after full UIArea rendering: "+e,null,this);}}}else{r.debug("Full Rendering of UIArea '"+this.getId()+"' postponed, no root node");}}else{var G=function(J){for(;;){if(J.getMetadata&&J.getMetadata().isInstanceOf("sap.ui.core.PopupInterface")){break;}J=J.getParent();if(!J||J===t){return false;}if(s.hasOwnProperty(J.getId())){return true;}}};for(var n in s){var H=this.oCore.byId(n);if(H&&!G(H)){H.rerender();u=true;}}}g(s,this.mInvalidatedControls);b.end(this.getId()+"---rerender");b.resume("renderPendingUIUpdates");return u;};U.prototype._onControlRendered=function(o){var i=o.getId();if(this.mInvalidatedControls[i]){delete this.mInvalidatedControls[i];}};U.rerenderControl=function(o){var e=null;if(o){e=o.getDomRef();if(!e||R.isPreservedContent(e)){e=(R.RenderPrefixes.Invisible+o.getId()?window.document.getElementById(R.RenderPrefixes.Invisible+o.getId()):null);}}var i=e&&e.parentNode;if(i){var u=o.getUIArea();var j=u?u.oCore.oRenderManager:sap.ui.getCore().createRenderManager();r.debug("Rerender Control '"+o.getId()+"'"+(u?"":" (using a temp. RenderManager)"));R.preserveContent(e,true,false,o);j.render(o,i);}else{var u=o.getUIArea();u&&u._onControlRendered(o);r.warning("Couldn't rerender '"+o.getId()+"', as its DOM location couldn't be determined");}};var h=/^(mousedown|mouseup|click|keydown|keyup|keypress|touchstart|touchend|tap)$/;var p=[],P=[];var v={mousemove:1,mouseover:1,mouseout:1,scroll:1,dragover:1,dragenter:1,dragleave:1};U.addEventPreprocessor=function(e){p.push(e);};U.getEventPreprocessors=function(){return p;};U.addEventPostprocessor=function(e){P.push(e);};U.getEventPostprocessors=function(){return P;};U.configureEventLogging=function(e){Object.assign(v,e);return Object.assign({},v);};U.prototype._handleEvent=function(e){var t,o,j;t=o=q(e.target).control(0);A.refresh();if(t==null){return;}if(e.isMarked("delayedMouseEvent")){return;}var H=e.getMark("handledByUIArea"),s=this.getId();if(H&&H!==s){e.setMark("firstUIArea",false);return;}e.setMarked("firstUIArea");e.srcControl=t;if(e.type==="contextmenu"&&e.shiftKey&&e.altKey&&!!(e.metaKey||e.ctrlKey)){L.info("Suppressed forwarding the contextmenu event as control event because CTRL+SHIFT+ALT is pressed!");return;}p.forEach(function(u){u(e);});this.oCore._handleControlEvent(e,s);if(this.bLocked||this.oCore.isLocked()){return;}if(I.getActive()){j=e.type.match(h);if(j){I.notifyEventStart(e);}}var k=[];if(e.getPseudoTypes){k=e.getPseudoTypes();}k.push(e.type);var G=false;while(o instanceof E&&o.isActive()&&!e.isPropagationStopped()){for(var i=0,l=k.length;i<l;i++){var T=k[i];e.type=T;e.currentTarget=o.getDomRef();o._handleEvent(e);if(e.isImmediatePropagationStopped()){break;}}if(!G&&!e.isMarked("enterKeyConsumedAsContent")){G=this._handleGroupChange(e,o);}if(e.isPropagationStopped()){break;}if(o.bStopEventBubbling){break;}var m=o.getDomRef();if(!m){break;}m=m.parentNode;o=null;if(e.isMarked("fromMouseout")&&c(m,e.relatedTarget)){break;}while(m&&m!==this.getRootNode()){if(m.id){o=q(m).control(0);if(o){break;}}m=m.parentNode;}}P.forEach(function(u){u(e);});if(j){I.notifyEventEnd(e);}e.currentTarget=this.getRootNode();e.setMark("handledByUIArea",s);if(e.isPropagationStopped()){L.debug("'"+e.type+"' propagation has been stopped");}var n=e.type;if(!v[n]){if(t){L.debug("Event fired: '"+n+"' on "+t,"","sap.ui.core.UIArea");}else{L.debug("Event fired: '"+n+"'","","sap.ui.core.UIArea");}}};U.prototype._onattach=function(){var o=this.getRootNode();if(o==null){return;}q(o).attr("data-sap-ui-area",o.id).bind(C.events.join(" "),this._handleEvent.bind(this));};U.prototype._ondetach=function(){var o=this.getRootNode();if(o==null){return;}q(o).removeAttr("data-sap-ui-area").unbind();};U.prototype.clone=function(){throw new Error("UIArea can't be cloned");};U.prototype._handleGroupChange=function(e,o){var k=U._oFieldGroupValidationKey;if(e.type==="focusin"){if(U._iFieldGroupDelayTimer){clearTimeout(U._iFieldGroupDelayTimer);U._iFieldGroupDelayTimer=null;}U._iFieldGroupDelayTimer=setTimeout(this.setFieldGroupControl.bind(this,o),0);return true;}else if(this.getFieldGroupControl()&&e.type==="keyup"&&e.keyCode===k.keyCode&&e.shiftKey===k.shiftKey&&e.altKey===k.altKey&&e.ctrlKey===k.ctrlKey){if(U._iFieldGroupTriggerDelay){clearTimeout(U._iFieldGroupTriggerDelay);}var i=this.getFieldGroupControl(),j=(i?i._getFieldGroupIds():[]);if(j.length>0){i.triggerValidateFieldGroup(j);}return true;}return false;};U.prototype.setFieldGroupControl=function(e){var o=e;while(o&&!(o instanceof E&&o.isA("sap.ui.core.Control"))){o=o.getParent();}var i=this.getFieldGroupControl();if(o!=i){var j=(i?i._getFieldGroupIds():[]),n=(o?o._getFieldGroupIds():[]),t=j.filter(function(s){return n.indexOf(s)<0;});if(t.length>0){i.triggerValidateFieldGroup(t);}U._oFieldGroupControl=o;}return this;};U.prototype.getFieldGroupControl=function(){if(U._oFieldGroupControl&&!U._oFieldGroupControl.bIsDestroyed){return U._oFieldGroupControl;}return null;};U._oFieldGroupControl=null;U._iFieldGroupDelayTimer=null;U._oFieldGroupValidationKey={keyCode:K.ENTER,shiftKey:false,altKey:false,ctrlKey:false};U._oRenderLog=r;return U;});
