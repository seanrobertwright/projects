/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/fl/write/_internal/connectors/BackendConnector",
	"sap/ui/fl/apply/_internal/connectors/KeyUserConnector",
	"sap/ui/fl/apply/_internal/connectors/Utils"
], function(
	merge,
	BackendConnector,
	ApplyConnector,
	ApplyUtils
) {
	"use strict";

	var PREFIX = "/flex/keyuser";
	var API_VERSION = "/v1";

	function _enhancePropertyBagWithTokenInfo(mPropertyBag) {
		mPropertyBag.applyConnector = ApplyConnector;
		mPropertyBag.xsrfToken = ApplyConnector.xsrfToken;
		mPropertyBag.tokenUrl = KeyUserConnector.ROUTES.TOKEN;
	}

	function _enhancePropertyBagForDraftActivation(mPropertyBag) {
		var oPayload = {
			title: mPropertyBag.title
		};
		mPropertyBag.payload = JSON.stringify(oPayload);
		mPropertyBag.dataType = "json";
		mPropertyBag.contentType = "application/json; charset=utf-8";
	}
	/**
	 * Connector for saving and deleting data from SAPUI5 Flexibility KeyUser service.
	 *
	 * @namespace sap.ui.fl.write._internal.connectors.KeyUserConnector
	 * @since 1.70
	 * @version 1.76.0
	 * @private
	 * @ui5-restricted sap.ui.fl.write._internal.Storage
	 */
	var KeyUserConnector = merge({}, BackendConnector, /** @lends sap.ui.fl.write._internal.connectors.KeyUserConnector */ {
		layers: ApplyConnector.layers,

		ROUTES: {
			CHANGES: PREFIX + API_VERSION + "/changes/",
			SETTINGS: PREFIX + API_VERSION + "/settings",
			TOKEN: PREFIX + API_VERSION + "/settings",
			VERSIONS: {
				GET: PREFIX + API_VERSION + "/versions/",
				ACTIVATE: PREFIX + API_VERSION + "/versions/activate/",
				DISCARD: PREFIX + API_VERSION + "/versions/draft/"
			}
		}
	});

	KeyUserConnector.versions = {
		load: function (mPropertyBag) {
			_enhancePropertyBagWithTokenInfo(mPropertyBag);
			var sVersionsUrl = ApplyUtils.getUrl(KeyUserConnector.ROUTES.VERSIONS.GET, mPropertyBag);
			return ApplyUtils.sendRequest(sVersionsUrl, "GET", mPropertyBag).then(function (oResult) {
				return oResult.response;
			});
		},
		activate: function (mPropertyBag) {
			_enhancePropertyBagWithTokenInfo(mPropertyBag);
			_enhancePropertyBagForDraftActivation(mPropertyBag);
			var sVersionsUrl = ApplyUtils.getUrl(KeyUserConnector.ROUTES.VERSIONS.ACTIVATE, mPropertyBag, {version: 0});
			return ApplyUtils.sendRequest(sVersionsUrl, "POST", mPropertyBag).then(function (oResult) {
				return oResult.response;
			});
		},
		discardDraft: function (mPropertyBag) {
			_enhancePropertyBagWithTokenInfo(mPropertyBag);
			var sVersionsUrl = ApplyUtils.getUrl(KeyUserConnector.ROUTES.VERSIONS.DISCARD, mPropertyBag);
			return ApplyUtils.sendRequest(sVersionsUrl, "DELETE", mPropertyBag);
		}
	};

	KeyUserConnector.applyConnector = ApplyConnector;
	return KeyUserConnector;
}, true);
