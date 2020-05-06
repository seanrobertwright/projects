/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/FakeLrepConnector",
	"sap/ui/fl/apply/_internal/connectors/SessionStorageConnector",
	"sap/ui/fl/write/_internal/connectors/SessionStorageConnector"
],
function(
	FakeLrepConnector,
	ApplySessionStorageConnector,
	WriteSessionStorageConnector
) {
	"use strict";

	/**
	 * Class for storing changes in session storage
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 1.76.0
	 *
	 * @private
	 * @static
	 * @since 1.58
	 * @alias sap.ui.fl.FakeLrepConnectorSessionStorage
	 */

	return {
		enableFakeConnector: function (mPropertyBag) {
			var sJsonPath = mPropertyBag ? mPropertyBag.sInitialComponentJsonPath : undefined;
			FakeLrepConnector.setFlexibilityServicesAndClearCache("SessionStorageConnector", sJsonPath);
		},
		disableFakeConnector: function() {
			FakeLrepConnector.disableFakeConnector();
		},
		forTesting: {
			spyWrite: function (sandbox, assert) {
				return FakeLrepConnector.forTesting.spyMethod(sandbox, assert, WriteSessionStorageConnector, "write");
			},
			getNumberOfChanges: function (sReference) {
				return FakeLrepConnector.forTesting.getNumberOfChanges(ApplySessionStorageConnector, sReference);
			},
			clear: function(mPropertyBag) {
				return FakeLrepConnector.forTesting.clear(WriteSessionStorageConnector, mPropertyBag);
			},
			setStorage: function(oNewStorage) {
				FakeLrepConnector.forTesting.setStorage(ApplySessionStorageConnector, oNewStorage);
			},
			synchronous: {
				clearAll: function () {
					FakeLrepConnector.forTesting.synchronous.clearAll(window.sessionStorage);
				},
				getNumberOfChanges: function(sReference) {
					return FakeLrepConnector.forTesting.synchronous.getNumberOfChanges(ApplySessionStorageConnector.oStorage, sReference);
				}
			}
		}
	};
}, /* bExport= */ true);