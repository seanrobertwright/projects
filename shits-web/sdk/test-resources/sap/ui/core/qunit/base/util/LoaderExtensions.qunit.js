
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
sap.ui.define(['sap/base/util/LoaderExtensions'], function(LoaderExtensions) {
	"use strict";

	QUnit.module("sap.base.util.LoaderExtensions");

	QUnit.test("getAllRequiredModules", function(assert) {
		assert.expect(6);
		var done = assert.async();

		var aModules = LoaderExtensions.getAllRequiredModules();
		assert.ok(Array.isArray(aModules), "should return an array");
		assert.ok(aModules.every(function(s){return typeof s == "string";}), "should only contain strings");
		assert.notOk(sap.ui.require('my.required.module'), "module has not yet been loaded");
		assert.notOk(aModules.indexOf('my.required.module') != -1, "module is not contained");

		sap.ui.define('my.required.module', [], function() {
			return {};
		});

		sap.ui.require(['my.required.module'], function(module) {
			aModules = LoaderExtensions.getAllRequiredModules();
			assert.ok(module, "module has been loaded");
			assert.ok(aModules.indexOf('my.required.module') != -1, "module is contained");
			done();
		});
	});


});