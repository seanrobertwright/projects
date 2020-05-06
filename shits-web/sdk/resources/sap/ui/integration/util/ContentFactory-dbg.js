/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/base/Object",
	"sap/f/cards/BindingHelper",
	"./CardActions"
], function (
	Core,
	BaseObject,
	BindingHelper,
	CardActions
) {
	"use strict";

	/**
	 * Constructor for a new <code>ContentFactory</code>.
	 *
	 * @class
	 *
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.76.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.integration.util.ContentFactory
	 */
	var ContentFactory = BaseObject.extend("sap.ui.integration.util.ContentFactory", {
		metadata: {
			library: "sap.ui.integration"
		},
		constructor: function (oCard) {
			BaseObject.call(this);

			this._oCard = oCard;
		}
	});

	ContentFactory.prototype.create = function (sType, oConfiguration, oServiceManager, oDataProviderFactory, sAppId) {

		var oCard = this._oCard;

		return new Promise(function (resolve, reject) {
			var fnCreateContentInstance = function (Content) {
				var oContent = new Content(),
					oActions = new CardActions({
						card: oCard
					});

				oContent._sAppId = sAppId;
				oContent.setServiceManager(oServiceManager);
				oContent.setDataProviderFactory(oDataProviderFactory);
				oContent.setActions(oActions);

				if (sType.toLowerCase() !== "adaptivecard") {
					oContent.setConfiguration(BindingHelper.createBindingInfos(oConfiguration), sType);
				} else {
					oContent.setConfiguration(oConfiguration);
				}

				resolve(oContent);
			};

			try {
				switch (sType.toLowerCase()) {
					case "list":
						sap.ui.require(["sap/f/cards/ListContent"], fnCreateContentInstance);
						break;
					case "calendar":
						sap.ui.require(["sap/f/cards/CalendarContent"], fnCreateContentInstance);
						break;
					case "table":
						sap.ui.require(["sap/f/cards/TableContent"], fnCreateContentInstance);
						break;
					case "object":
						sap.ui.require(["sap/f/cards/ObjectContent"], fnCreateContentInstance);
						break;
					case "analytical":
						Core.loadLibrary("sap.viz", {
							async: true
						})
							.then(function () {
								sap.ui.require(["sap/f/cards/AnalyticalContent"], fnCreateContentInstance);
							})
							.catch(function () {
								reject("Analytical content type is not available with this distribution.");
							});
						break;
					case "analyticscloud":
						sap.ui.require(["sap/f/cards/AnalyticsCloudContent"], fnCreateContentInstance);
						break;
					case "timeline":
						Core.loadLibrary("sap.suite.ui.commons", {
							async: true
						})
							.then(function() {
								sap.ui.require(["sap/f/cards/TimelineContent"], fnCreateContentInstance);
							})
							.catch(function () {
								reject("Timeline content type is not available with this distribution.");
							});
						break;
					case "component":
						sap.ui.require(["sap/f/cards/ComponentContent"], fnCreateContentInstance);
						break;
					case "adaptivecard":
						sap.ui.require(["sap/f/cards/AdaptiveContent"], fnCreateContentInstance);
						break;
					default:
						reject(sType.toUpperCase() + " content type is not supported.");
				}
			} catch (sError) {
				reject(sError);
			}
		});
	};

	return ContentFactory;
});
