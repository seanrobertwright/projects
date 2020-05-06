/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/EventProvider','sap/ui/thirdparty/datajs','sap/ui/core/cache/CacheManager','./_ODataMetaModelUtils',"sap/base/util/uid","sap/base/Log","sap/base/assert","sap/base/util/each","sap/ui/thirdparty/jquery"],function(E,O,C,U,u,L,a,e,q){"use strict";var b=E.extend("sap.ui.model.odata.ODataMetadata",{constructor:function(m,p){E.apply(this,arguments);this.bLoaded=false;this.bFailed=false;this.mEntityTypes={};this.mRequestHandles={};this.sUrl=m;this.bAsync=p.async;this.sUser=p.user;this.bWithCredentials=p.withCredentials;this.sPassword=p.password;this.mHeaders=p.headers;this.sCacheKey=p.cacheKey;this.oLoadEvent=null;this.oFailedEvent=null;this.oMetadata=null;this.bMessageScopeSupported=false;this.mNamespaces=p.namespaces||{sap:"http://www.sap.com/Protocols/SAPData",m:"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata","":"http://schemas.microsoft.com/ado/2007/06/edmx"};var t=this;this.fnResolve;this.pLoaded=new Promise(function(r,c){t.fnResolve=r;});function w(p){C.set(t.sCacheKey,JSON.stringify({metadata:t.oMetadata,params:p}));}function l(o){L.error("[ODataMetadata] initial loading of metadata failed");if(o&&o.message){L.error("Error: "+o.message);}}if(this.sCacheKey){C.get(this.sCacheKey).then(function(M){if(M){var c=JSON.parse(M);this.oMetadata=c.metadata;this._handleLoaded(this.oMetadata,c.params,false);}else{this._loadMetadata().then(w).catch(l);}}.bind(this)).catch(l);}else{this._loadMetadata().catch(l);}},metadata:{publicMethods:["getServiceMetadata","attachFailed","detachFailed","attachLoaded","detachLoaded","refresh"]}});b.prototype._setNamespaces=function(n){this.mNamespaces=n;};b.prototype._handleLoaded=function(m,p,s){var c=[];this.oMetadata=this.oMetadata?this.merge(this.oMetadata,m,c):m;this.oRequestHandle=null;p.entitySets=c;this.fnResolve(p);if(this.bAsync&&!s){this.fireLoaded(this);}else if(!this.bAsync&&!s){this.bLoaded=true;this.bFailed=false;this.oLoadEvent=setTimeout(this.fireLoaded.bind(this,p),0);}};b.prototype._loadMetadata=function(s,S){var t=this;s=s||this.sUrl;var r=this._createRequest(s);return new Promise(function(c,d){var R;function _(m,o){if(!m||!m.dataServices){var p={message:"Invalid metadata document",request:r,response:o};f(p);return;}t.sMetadataBody=o.body;t.oRequestHandle=null;var P={metadataString:t.sMetadataBody};var l=o.headers["Last-Modified"];if(l){P.lastModified=l;}var h=o.headers["eTag"];if(h){P.eTag=h;}t._handleLoaded(m,P,S);c(P);}function f(o){var p={message:o.message,request:o.request,response:o.response};if(o.response){p.statusCode=o.response.statusCode;p.statusText=o.response.statusText;p.responseText=o.response.body;}if(R&&R.bSuppressErrorHandlerCall){return;}if(t.bAsync){delete t.mRequestHandles[R.id];}d(p);if(t.bAsync&&!S){t.fireFailed(p);}else if(!t.bAsync&&!S){t.bFailed=true;t.oFailedEvent=setTimeout(t.fireFailed.bind(t,p),0);}}R=O.request(r,_,f,O.metadataHandler);if(t.bAsync){R.id=u();t.mRequestHandles[R.id]=R;}});};b.prototype.refresh=function(){return this._loadMetadata();};b.prototype.getServiceMetadata=function(){return this.oMetadata;};b.prototype.isLoaded=function(){return this.bLoaded;};b.prototype.loaded=function(){return this.pLoaded;};b.prototype.isFailed=function(){return this.bFailed;};b.prototype.fireLoaded=function(p){this.bLoaded=true;this.bFailed=false;this.fireEvent("loaded",p);L.debug(this+" - loaded was fired");return this;};b.prototype.attachLoaded=function(d,f,l){this.attachEvent("loaded",d,f,l);return this;};b.prototype.detachLoaded=function(f,l){this.detachEvent("loaded",f,l);return this;};b.prototype.fireFailed=function(p){this.bFailed=true;this.fireEvent("failed",p);return this;};b.prototype.attachFailed=function(d,f,l){this.attachEvent("failed",d,f,l);return this;};b.prototype.detachFailed=function(f,l){this.detachEvent("failed",f,l);return this;};b.prototype._getEntityAssociationEnd=function(o,n){var c;if(!this._checkMetadataLoaded()){return null;}this._mGetEntityAssociationEndCache=this._mGetEntityAssociationEndCache||{};c=o.namespace+"."+o.name+"/"+n;if(this._mGetEntityAssociationEndCache[c]===undefined){var N=o?U.findObject(o.navigationProperty,n):null,A=N?U.getObject(this.oMetadata.dataServices.schema,"association",N.relationship):null,d=A?U.findObject(A.end,N.toRole,"role"):null;this._mGetEntityAssociationEndCache[c]=d;}return this._mGetEntityAssociationEndCache[c];};function g(s){var m={};for(var i=0;i<s.length;i++){var S=s[i];if(S.entityContainer){for(var j=0;j<S.entityContainer.length;j++){var o=S.entityContainer[j];if(o.entitySet){for(var k=0;k<o.entitySet.length;k++){if(o.entitySet[k].name!=null){m[o.entitySet[k].name]=o.entitySet[k];}}}}}}return m;}b.prototype._findEntitySetByName=function(n){if(!this.mEntitySets){this.mEntitySets=g(this.oMetadata.dataServices.schema);}return this.mEntitySets[n];};b.prototype._getEntityTypeByPath=function(p){if(!p){a(undefined,"sPath not defined!");return null;}if(this.mEntityTypes[p]){return this.mEntityTypes[p];}if(!this._checkMetadataLoaded()){return null;}var c=p.replace(/^\/|\/$/g,""),P=c.split("/"),l=P.length,o,d,f,r,t=this;if(P[0].indexOf("(")!=-1){P[0]=P[0].substring(0,P[0].indexOf("("));}if(l>1){o=t._getEntityTypeByPath(P[0]);for(var i=1;i<P.length;i++){if(o){if(P[i].indexOf("(")!=-1){P[i]=P[i].substring(0,P[i].indexOf("("));}r=t._getEntityTypeByNavProperty(o,P[i]);if(r){o=r;}f=o;}}}else{d=this._splitName(this._getEntityTypeName(P[0]));f=this._getObjectMetadata("entityType",d.name,d.namespace);if(f){f.entityType=this._getEntityTypeName(P[0]);}}if(!f){var F=P[P.length-1];var h=this._getFunctionImportMetadata(F,"GET");if(!h){h=this._getFunctionImportMetadata(F,"POST");}if(h&&h.entitySet){f=Object.assign({},this._getEntityTypeByPath(h.entitySet));if(f){f.entityType=this._getEntityTypeName(h.entitySet);f.isFunction=true;}}}if(f){this.mEntityTypes[p]=f;}return f;};b.prototype._getEntityTypeByName=function(n){var o,t=this,s,N,c;if(!n){a(undefined,"sName not defined!");return null;}c=this._splitName(n);N=c.namespace;s=c.name;if(!this._checkMetadataLoaded()){return null;}if(this.mEntityTypes[n]){o=this.mEntityTypes[n];}else{q.each(this.oMetadata.dataServices.schema,function(i,S){if(S.entityType&&(!N||S.namespace===N)){q.each(S.entityType,function(k,d){if(d.name===s){o=d;t.mEntityTypes[n]=o;o.namespace=S.namespace;return false;}});}});}return o;};b.prototype._checkMetadataLoaded=function(){if(!this.oMetadata||q.isEmptyObject(this.oMetadata)){a(undefined,"No metadata loaded!");return false;}return true;};b.prototype._getAnnotation=function(p){var n,P,m,M,o,s,c;P=p.split('/#');M=P[1].split('/');if(!P[0]){o=this._getEntityTypeByName(M[0]);a(o,M[0]+" is not a valid EntityType");if(!o){return;}s=P[1].substr(P[1].indexOf('/')+1);c=this._getPropertyMetadata(o,s);a(c,s+" is not a valid property path");if(!c){return;}m=s.substr(s.indexOf(c.name));m=m.substr(m.indexOf('/')+1);}else{o=this._getEntityTypeByPath(P[0]);a(o,P[0]+" is not a valid path");if(!o){return;}p=P[0].replace(/^\/|\/$/g,"");s=p;while(!c&&s.indexOf("/")>0){s=s.substr(s.indexOf('/')+1);c=this._getPropertyMetadata(o,s);}a(c,s+" is not a valid property path");if(!c){return;}m=M.join('/');}n=this._getAnnotationObject(o,c,m);return n;};b.prototype._getAnnotationObject=function(o,c,m){var A,p,d,n,s;if(!c){return;}n=c;p=m.split('/');if(p[0].indexOf('.')>-1){return this._getV4AnnotationObject(o,c,p);}else{if(p.length>1){n=n[p[0]];if(!n&&c.extensions){for(var i=0;i<c.extensions.length;i++){var f=c.extensions[i];if(f.name==p[0]){n=f;break;}}}m=p.splice(0,1);d=this._getAnnotationObject(o,n,p.join('/'));}else{if(p[0].indexOf('@')>-1){s=p[0].substr(1);A=s.split(':');d=n[A[0]];if(!d&&n.extensions){for(var i=0;i<n.extensions.length;i++){var f=n.extensions[i];if(f.name===A[1]&&f.namespace===this.mNamespaces[A[0]]){d=f.value;break;}}}}else{A=p[0].split(':');d=n[A[0]];d=n[p[0]];if(!d&&n.extensions){for(var i=0;i<n.extensions.length;i++){var f=n.extensions[i];if(f.name===A[1]&&f.namespace===this.mNamespaces[A[0]]){d=f;break;}}}}}}return d;};b.prototype._getV4AnnotationObject=function(o,c,p){var A,d=[];if(p.length>1){a(p.length==1,"'"+p.join('/')+"' is not a valid annotation path");return;}var t=o.namespace?o.namespace+".":"";t+=o.name+"/"+c.name;q.each(this.oMetadata.dataServices.schema,function(i,s){if(s.annotations){q.each(s.annotations,function(k,c){if(c.target===t&&!c.qualifier){d.push(c.annotation);return false;}});}});if(d){q.each(d,function(i,f){q.each(f,function(j,h){if(h.term===p[0]){A=h;}});});}return A;};b.prototype._splitName=function(f){var i={};if(f){var s=f.lastIndexOf(".");i.name=f.substr(s+1);i.namespace=f.substr(0,s);}return i;};b.prototype._getEntityTypeName=function(c){var s,o;if(c){o=this._findEntitySetByName(c);if(o){s=o.entityType;}}return s;};b.prototype._getObjectMetadata=function(o,s,n){var c;if(s&&n){q.each(this.oMetadata.dataServices.schema,function(i,S){if(S[o]&&S.namespace===n){q.each(S[o],function(j,d){if(d.name===s){c=d;c.namespace=S.namespace;return false;}});return!c;}});}return c;};b.prototype.getUseBatch=function(){var c=false;q.each(this.oMetadata.dataServices.schema,function(i,s){if(s.entityContainer){q.each(s.entityContainer,function(k,o){if(o.extensions){q.each(o.extensions,function(l,d){if(d.name==="use-batch"&&d.namespace==="http://www.sap.com/Protocols/SAPData"){c=(typeof d.value==='string')?(d.value.toLowerCase()==='true'):!!d.value;return false;}});}});}});return c;};b.prototype._getFunctionImportMetadataIterate=function(c,s){var o=[];e(this.oMetadata.dataServices.schema,function(S,d){if(d["entityContainer"]){e(d["entityContainer"],function(i,f){if(f["functionImport"]){e(f["functionImport"],function(F,h){if(c(h)){o.push(h);if(s){return false;}}});}return!(s&&o.length===1);});}return!(s&&o.length===1);});return o;};b.prototype._getFirstMatchingFunctionImportMetadata=function(c){var o=this._getFunctionImportMetadataIterate(c,true);return o.length===1?o[0]:null;};b.prototype._getFunctionImportMetadataByName=function(f){if(f.indexOf("/")>-1){f=f.substr(f.indexOf("/")+1);}return this._getFunctionImportMetadataIterate(function(F){return F.name===f;});};b.prototype._getFunctionImportMetadata=function(f,m){if(f.indexOf("/")>-1){f=f.substr(f.indexOf("/")+1);}return this._getFirstMatchingFunctionImportMetadata(function(F){return F.name===f&&F.httpMethod===m;});};b.prototype._getEntityTypeByNavProperty=function(m,n){if(!m.navigationProperty){return undefined;}for(var i=0;i<m.navigationProperty.length;++i){var N=m.navigationProperty[i];if(N.name===n){return this._getEntityTypeByNavPropertyObject(N);}}return undefined;};b.prototype._getEntityTypeByNavPropertyObject=function(n){var t;var A=this._splitName(n.relationship);var m=this._getObjectMetadata("association",A.name,A.namespace);if(m){var c=m.end[0];if(c.role!==n.toRole){c=m.end[1];}var o=this._splitName(c.type);t=this._getObjectMetadata("entityType",o.name,o.namespace);if(t){t.entityType=c.type;}}return t;};b.prototype._getNavigationPropertyNames=function(o){var n=[];if(o.navigationProperty){q.each(o.navigationProperty,function(k,N){n.push(N.name);});}return n;};b.prototype._getNavPropertyRefInfo=function(o,p){var n,A,c,d,P,D,f,r,h,s,k,t=this;e(o.navigationProperty,function(i,N){c=t._splitName(N.relationship);A=t._getObjectMetadata("association",c.name,c.namespace);if(!A||!A.referentialConstraint){return;}D=A.referentialConstraint.dependent;h=A.end.find(function(h){return h.role===D.role;});if(h.type!==o.namespace+"."+o.name){return;}f=D.propertyRef.some(function(j){return j.name===p;});if(!f){return;}P=A.referentialConstraint.principal;r=P.role;d=t._getAssociationSetByAssociation(N.relationship);h=d.end.find(function(h){return h.role===r;});s=h.entitySet;k=P.propertyRef.map(function(j){return j.name;});n={name:N.name,entitySet:s,keys:k};});return n;};b.prototype._getPropertyMetadata=function(o,p){var P,t=this;if(!o){return;}p=p.replace(/^\/|\/$/g,"");var c=p.split("/");q.each(o.property,function(k,d){if(d.name===c[0]){P=d;return false;}});if(c.length>1){if(!P){while(o&&c.length>1){o=this._getEntityTypeByNavProperty(o,c[0]);c.shift();}if(o){P=t._getPropertyMetadata(o,c[0]);}}else if(!P.type.toLowerCase().startsWith("edm.")){var n=this._splitName(P.type);P=this._getPropertyMetadata(this._getObjectMetadata("complexType",n.name,n.namespace),c[1]);}}return P;};b.prototype.destroy=function(){delete this.oMetadata;var t=this;q.each(this.mRequestHandles,function(k,r){r.bSuppressErrorHandlerCall=true;r.abort();delete t.mRequestHandles[k];});if(!!this.oLoadEvent){clearTimeout(this.oLoadEvent);}if(!!this.oFailedEvent){clearTimeout(this.oFailedEvent);}E.prototype.destroy.apply(this,arguments);};b.prototype._fillElementCaches=function(){var t=this;if(this._entitySetMap||!this._checkMetadataLoaded()){return;}this._entitySetMap={};this.oMetadata.dataServices.schema.forEach(function(s){(s.entityContainer||[]).forEach(function(c){(c.entitySet||[]).forEach(function(m){var o=t._getEntityTypeByName(m.entityType);o.__navigationPropertiesMap={};(o.navigationProperty||[]).forEach(function(p){o.__navigationPropertiesMap[p.name]=p;});m.__entityType=o;t._entitySetMap[m.entityType]=m;});});});};b.prototype._createRequest=function(s){var d={"sap-cancel-on-close":true},l={"Accept-Language":sap.ui.getCore().getConfiguration().getLanguageTag()};q.extend(d,this.mHeaders,l);var r={headers:d,requestUri:s,method:'GET',user:this.sUser,password:this.sPassword,async:this.bAsync};if(this.bAsync){r.withCredentials=this.bWithCredentials;}return r;};b.prototype._getEntitySetByPath=function(s){var o;this._fillElementCaches();o=this._getEntityTypeByPath(s);if(o){return this._entitySetMap[o.entityType];}};b.prototype._addUrl=function(v){var c=[].concat(v);return Promise.all(c.map(function(s){return this._loadMetadata(s,true);},this));};b.prototype.merge=function(t,s,c){var d=this;if(this.mEntitySets){delete this.mEntitySets;}q.each(t.dataServices.schema,function(i,T){q.each(s.dataServices.schema,function(j,S){if(S.namespace===T.namespace){if(S.entityType){if(!d.mEntityTypeNames){d.mEntityTypeNames={};T.entityType.map(function(o){d.mEntityTypeNames[o.name]=true;});}T.entityType=!T.entityType?[]:T.entityType;for(var i=0;i<S.entityType.length;i++){if(!(S.entityType[i].name in d.mEntityTypeNames)){T.entityType.push(S.entityType[i]);d.mEntityTypeNames[S.entityType[i].name]=true;}}}if(T.entityContainer&&S.entityContainer){q.each(T.entityContainer,function(k,f){q.each(S.entityContainer,function(l,h){if(h.entitySet){if(h.name===f.name){if(!d.mEntitySetNames){d.mEntitySetNames={};f.entitySet.map(function(o){d.mEntitySetNames[o.name]=true;});}f.entitySet=!f.entitySet?[]:f.entitySet;for(var i=0;i<h.entitySet.length;i++){if(!(h.entitySet[i].name in d.mEntitySetNames)){f.entitySet.push(h.entitySet[i]);d.mEntitySetNames[h.entitySet[i].name]=true;}}h.entitySet.forEach(function(o){c.push(o);});}}});});}if(S.annotations){T.annotations=!T.annotations?[]:T.annotations;T.annotations=T.annotations.concat(S.annotations);}}});});return t;};b.prototype._getEntitySetByType=function(c){var s=c.namespace+"."+c.name;var S=this.oMetadata.dataServices.schema;for(var i=0;i<S.length;++i){var d=S[i].entityContainer;if(d){for(var n=0;n<d.length;++n){var f=d[n].entitySet;if(f){for(var m=0;m<f.length;++m){if(f[m].entityType===s){return f[m];}}}}}}return null;};b.prototype._calculateCanonicalPath=function(p){var c,i,P,t;if(p){i=p.lastIndexOf(")");if(i!==-1){t=p.substr(0,i+1);var o=this._getEntitySetByPath(t);if(o){if(o.__entityType.isFunction){c=p;}else{P=p.split("/");if(t==="/"+P[1]){if(!(P[2]in o.__entityType.__navigationPropertiesMap)){c=p;}}else{P=t.split("/");t='/'+o.name+P[P.length-1].substr(P[P.length-1].indexOf("("))+p.substr(i+1);if(t!==p){c=t;}}}}}}return c;};b.prototype._getAssociationSetByAssociation=function(A){var s=this.oMetadata.dataServices.schema;for(var i=0;i<s.length;++i){var c=s[i].entityContainer;if(c){for(var n=0;n<c.length;++n){var S=c[n].associationSet;if(S){for(var m=0;m<S.length;++m){if(S[m].association===A){return S[m];}}}}}}return null;};b.prototype._isMessageScopeSupported=function(){var s=this.oMetadata.dataServices.schema,c,d;if(!this.bMessageScopeSupported&&s){for(var i=0;i<s.length;++i){d=s[i].entityContainer;if(d){for(var n=0;n<d.length;++n){c=d[n];if(c.extensions&&Array.isArray(c.extensions)){for(var m=0;m<c.extensions.length;++m){if(c.extensions[m].name==="message-scope-supported"&&c.extensions[m].namespace===this.mNamespaces.sap){if(c.extensions[m].value==="true"){this.bMessageScopeSupported=true;break;}}}}}}}}return this.bMessageScopeSupported;};b.prototype._isCollection=function(p){var c=false;var i=p.lastIndexOf("/");if(i>0){var s=p.substring(0,i);var o=this._getEntityTypeByPath(s);if(o){var A=this._getEntityAssociationEnd(o,p.substring(i+1));if(A&&A.multiplicity==="*"){c=true;}}}else{c=true;}return c;};b.prototype._getReducedPath=function(p){var A,i,k,n,N,o,s,S=p.split("/"),c;if(S.length<4){return p;}this._fillElementCaches();for(i=1;i<S.length-2;i+=1){c=this._getEntityTypeByPath(S.slice(0,i+1).join('/'));N=c&&c.__navigationPropertiesMap[S[i+1].split("(")[0]];if(!N){continue;}s=S[i+2].split("(")[0];n=this._getEntityTypeByNavPropertyObject(N);o=n&&n.__navigationPropertiesMap[s];if(!o||N.relationship!==o.relationship){continue;}k=S[i+2].slice(s.length);A=this._getEntityAssociationEnd(n,s);if(A.multiplicity!=="*"||k&&S[i].endsWith(k)){S.splice(i+1,2);return this._getReducedPath(S.join("/"));}}return S.join("/");};return b;});
