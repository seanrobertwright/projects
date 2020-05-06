/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var M={apiVersion:2};M.render=function(r,m){var a=sap.ui.getCore().getConfiguration().getAccessibility(),R=m.getRootMenu();if(m.oHoveredItem&&m.indexOfItem(m.oHoveredItem)<0){m.oHoveredItem=null;}r.openStart("div",m);r.attr("tabindex",-1);r.attr("hideFocus",true);if(m.getTooltip_AsString()){r.attr("title",m.getTooltip_AsString());}if(a){r.accessibilityState(m,{disabled:null,labelledby:{value:m.getId()+"-label",append:true}});}r.class("sapUiMnu");if(R.bUseTopStyle){r.class("sapUiMnuTop");}if(R.isCozy()){r.class("sapUiSizeCozy");}if(m.bCozySupported){r.class("sapUiMnuCozySupport");}r.openEnd();M.renderItems(r,m);if(a){r.openStart("span",m.getId()+"-label");r.class("sapUiInvisibleText");r.attr("aria-hidden",true);r.openEnd();r.text(m.getAriaDescription()?m.getAriaDescription():"");r.close("span");}r.close("div");};M.renderItems=function(r,m){var I=m.getItems(),a=sap.ui.getCore().getConfiguration().getAccessibility(),h=false,H=false,n=0,b=0,i,o;r.openStart("ul");r.attr("role","menu");r.class("sapUiMnuLst");for(i=0;i<I.length;i++){if(I[i].getIcon&&I[i].getIcon()){h=true;}if(I[i].getSubmenu()){H=true;}}if(!h){r.class("sapUiMnuNoIco");}if(!H){r.class("sapUiMnuNoSbMnu");}r.openEnd();n=0;for(i=0;i<I.length;i++){if(I[i].getVisible()&&I[i].render){n++;}}for(i=0;i<I.length;i++){o=I[i];if(o.getVisible()&&o.render){b++;if(o.getStartsSection()){r.openStart("li");if(a){r.attr("role","separator");}r.class("sapUiMnuDiv");r.openEnd();r.openStart("div");r.class("sapUiMnuDivL");r.openEnd();r.close("div");r.voidStart("hr").voidEnd();r.openStart("div");r.class("sapUiMnuDivR");r.openEnd();r.close("div");r.close("li");}o.render(r,o,m,{bAccessible:a,iItemNo:b,iTotalItems:n});}}r.close("ul");};return M;},true);
