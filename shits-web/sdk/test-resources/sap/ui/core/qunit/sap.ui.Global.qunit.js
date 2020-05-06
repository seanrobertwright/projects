/* global QUnit, sinon*/
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/VersionInfo"
], function(jQuery, VersionInfo) {
	"use strict";

	// NOTE:
	// "sap.ui.versioninfo" will only be cleared AFTER each test which will result into
	// a failure of the first test when the core or some initial module loads the versioninfo
	// right away. If this is the case and the behavior is expected these module/tests should be adopted.
	QUnit.module("sap.ui.getVersionInfo", {
		beforeEach: function() {
			// Define mocked version info
			this.oVersionInfo = {
				"name": "qunit",
				"version": "1.0.0",
				"buildTimestamp": "<TIMESTAMP>",
				"scmRevision": "<HASH>",
				"gav": "<GAV>",
				"libraries": [{
					"name": "sap.ui.core",
					"version": "1.1.1",
					"buildTimestamp": "<CORE.TIMESTAMP>",
					"scmRevision": "<CORE.HASH>",
					"gav": "<CORE.GAV>"
				}]
			};

			this.oDeprecatedAPISpy = this.spy(sap.ui, "getVersionInfo");
		},
		initFakeServer: function(sResponseCode) {
			this.oServer = this._oSandbox.useFakeServer();
			this.oServer.autoRespond = true;
			this.oServer.respondWith("GET", jQuery.sap.getResourcePath("sap-ui-version", ".json"), [
				sResponseCode || 200,
				{
					"Content-Type": "application/json"
				},
				JSON.stringify(this.oVersionInfo)
			]);
		},
		afterEach: function() {
			// Delete cached versionInfo data after each test
			delete sap.ui.versioninfo;
		}
	});

	QUnit.test("sync: all", function(assert) {
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.deepEqual(sap.ui.getVersionInfo(), this.oVersionInfo,
			"'sap.ui.getVersionInfo()' should synchronously load and return the full object.");

		assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
			"'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo()'.");

	});
	QUnit.test("sync: single library (string param)", function(assert) {
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.deepEqual(sap.ui.getVersionInfo("sap.ui.core"), this.oVersionInfo.libraries[0],
			"'sap.ui.getVersionInfo(\"sap.ui.core\")' should synchronously load and return the 'sap.ui.core' library info.");

		assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
			"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo(\"sap.ui.core\")'.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: single library (object param)", function(assert) {
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.deepEqual(sap.ui.getVersionInfo({
				library: "sap.ui.core"
			}), this.oVersionInfo.libraries[0],
			"'sap.ui.getVersionInfo({ library: \"sap.ui.core\" })' should synchronously load and return the 'sap.ui.core' library info.");

		assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
			"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\" })'.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: single library not found", function(assert) {
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.strictEqual(sap.ui.getVersionInfo("foo.bar"), undefined,
			"'sap.ui.getVersionInfo(\"foo.bar\")' should synchronously return undefined as 'foo.bar' library info does not exist.");

		assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
			"First library in 'sap.ui.versioninfo' should st be the same as the return value of 'sap.ui.getVersionInfo(\"sap.ui.core\")'.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: all - file not found (failOnError = true)", function(assert) {
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.throws(function() {
				sap.ui.getVersionInfo();
			},
			/resource sap-ui-version\.json could not be loaded/,
			"Should throw an error saying the file can not be found."
		);

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should still be undefined after calling the function.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: single library - file not found (failOnError = true)", function(assert) {
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.throws(function() {
				sap.ui.getVersionInfo("sap.ui.core");
			},
			/resource sap-ui-version\.json could not be loaded/,
			"Should throw an error saying the file can not be found."
		);

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should still be undefined after calling the function.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: all - file not found (failOnError = false)", function(assert) {
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.strictEqual(sap.ui.getVersionInfo({
				failOnError: false
			}), undefined,
			"'sap.ui.getVersionInfo({ failOnError: false })' should return 'undefined' in case of an error with 'failOnError' set to 'false'.");

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should still be undefined after calling the function.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});
	QUnit.test("sync: single library - file not found (failOnError = false)", function(assert) {
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		assert.strictEqual(sap.ui.getVersionInfo({
				library: "sap.ui.core",
				failOnError: false
			}), undefined,
			"'sap.ui.getVersionInfo({ library: \"sap.ui.core\", failOnError: false })' should return 'undefined' in case of an error with 'failOnError' set to 'false'.");

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should still be undefined after calling the function.");

		assert.strictEqual(this.oServer.requests.length, 1,
			"Server should have received one request.");
		assert.ok(!this.oServer.requests[0].async,
			"Request should be sync.");

	});

	QUnit.test("async: all", function(assert) {
		var done = assert.async();
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo,
					"'sap.ui.getVersionInfo({ async: true })' should asynchronously load and return the full object.");

				assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
					"'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ async: true })'.");

				assert.strictEqual(this.oServer.requests.length, 1,
					"Server should have received one request.");
				assert.ok(this.oServer.requests[0].async,
					"Request should be async.");

			}.bind(this))
			.then(done);

	});
	QUnit.test("async: single library", function(assert) {
		var done = assert.async();
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
				library: "sap.ui.core",
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo.libraries[0],
					"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

				assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
					"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

				assert.strictEqual(this.oServer.requests.length, 1,
					"Server should have received one request.");
				assert.ok(this.oServer.requests[0].async,
					"Request should be async.");

			}.bind(this))
			.then(done);

	});
	QUnit.test("async: all + single library in parallel", function(assert) {
		var done = assert.async();
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		var oPromiseAll = sap.ui.getVersionInfo({
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo,
					"'sap.ui.getVersionInfo{ async: true }' should asynchronously load and return the full object.");

				assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
					"'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ async: true })'.");

			}.bind(this));

		var oPromiseLibrary = sap.ui.getVersionInfo({
				library: "sap.ui.core",
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo.libraries[0],
					"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

				assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
					"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

			}.bind(this));

		// Finish when both promises are resolved
		Promise.all([oPromiseAll, oPromiseLibrary]).then(function() {
			assert.strictEqual(this.oServer.requests.length, 1, "Two async calls in parallel should result in just one request.");
			assert.ok(this.oServer.requests[0].async, "Request should be async.");
		}.bind(this)).then(done);

	});
	QUnit.test("async: all then single library", function(assert) {
		var done = assert.async();
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo,
					"'sap.ui.getVersionInfo{ async: true }' should asynchronously load and return the full object.");

				assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
					"'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ async: true })'.");

			}.bind(this)).then(function() {
				return sap.ui.getVersionInfo({
						library: "sap.ui.core",
						async: true
					})
					.then(function(oVersionInfo) {

						assert.deepEqual(oVersionInfo, this.oVersionInfo.libraries[0],
							"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

						assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
							"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

						assert.strictEqual(this.oServer.requests.length, 1,
							"Server should have received one request.");
						assert.ok(this.oServer.requests[0].async,
							"Request should be async.");

					}.bind(this));
			}.bind(this)).then(done);

	});
	QUnit.test("async: all - file not found", function(assert) {
		var done = assert.async();
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
			async: true
		}).then(function() {
			assert.ok(false, "Promise should not get resolved.");
		}, function(err) {

			// Check if exception is correct
			sinon.assert.match(err.message, sinon.match("resource sap-ui-version.json could not be loaded"),
				"Should give an error saying the file can not be found.");

			assert.strictEqual(sap.ui.versioninfo, undefined,
				"'sap.ui.versioninfo' should still be undefined after calling the function.");

			assert.strictEqual(this.oServer.requests.length, 1,
				"Server should have received one request.");
			assert.ok(this.oServer.requests[0].async,
				"Request should be async.");

		}.bind(this)).then(done);

	});
	QUnit.test("async: single library - file not found", function(assert) {
		var done = assert.async();
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
			library: "sap.ui.core",
			async: true
		}).then(function() {
			assert.ok(false, "Promise should not get resolved.");
		}, function(err) {

			// Check if exception is correct
			sinon.assert.match(err.message, sinon.match("resource sap-ui-version.json could not be loaded"),
				"Should give an error saying the file can not be found.");

			assert.strictEqual(sap.ui.versioninfo, undefined,
				"'sap.ui.versioninfo' should still be undefined after calling the function.");

			assert.strictEqual(this.oServer.requests.length, 1,
				"Server should have received one request.");
			assert.ok(this.oServer.requests[0].async,
				"Request should be async.");

		}.bind(this)).then(done);

	});
	QUnit.test("library (async) + all (sync)", function(assert) {
		var done = assert.async();
		this.initFakeServer();

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should be undefined before calling the function.");

		sap.ui.getVersionInfo({
				library: "sap.ui.core",
				async: true
			})
			.then(function(oVersionInfo) {

				assert.deepEqual(oVersionInfo, this.oVersionInfo.libraries[0],
					"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

				assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
					"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

				assert.strictEqual(this.oServer.requests.length, 2,
					"Server should have received two request (async + sync).");
				assert.ok(this.oServer.requests[0].async,
					"First request should be async.");
				assert.ok(!this.oServer.requests[1].async,
					"Second request should be sync.");

			}.bind(this)).then(done);

		// synchronously load while async request is still ongoing

		assert.strictEqual(sap.ui.versioninfo, undefined,
			"'sap.ui.versioninfo' should still be undefined.");

		assert.deepEqual(sap.ui.getVersionInfo(), this.oVersionInfo,
			"'sap.ui.getVersionInfo()' should synchronously load and return the full object.");

		assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
			"'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo()'.");

	});

	QUnit.test("VersionInfo.load - Object Argument", function(assert) {
		var done = assert.async();

		this.initFakeServer();

		VersionInfo.load({
			library: "sap.ui.core"
		}).then(function(oVersionInfo) {

			assert.deepEqual(oVersionInfo, this.oVersionInfo.libraries[0],
				"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

			assert.deepEqual(sap.ui.versioninfo.libraries[0], this.oVersionInfo.libraries[0],
				"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

			assert.strictEqual(this.oServer.requests.length, 1,
				"Server should have received one request (async).");
			assert.ok(this.oServer.requests[0].async,
				"First request should be async.");

			assert.ok(this.oDeprecatedAPISpy.notCalled,
				"Deprecated function should not be called internally");

		}.bind(this)).then(done);
	});

	QUnit.test("VersionInfo.load - No Argument", function(assert) {
		var done = assert.async();

		this.initFakeServer();

		VersionInfo.load().then(function(oVersionInfo) {

			assert.deepEqual(oVersionInfo, this.oVersionInfo,
				"'sap.ui.getVersionInfo{ library: \"sap.ui.core\", async: true }' should asynchronously load and return the 'sap.ui.core' library info.");

			assert.deepEqual(sap.ui.versioninfo, this.oVersionInfo,
				"First library in 'sap.ui.versioninfo' should now be the same as the return value of 'sap.ui.getVersionInfo({ library: \"sap.ui.core\", async: true })'.");

			assert.strictEqual(this.oServer.requests.length, 1,
				"Server should have received one request (async).");
			assert.ok(this.oServer.requests[0].async,
				"First request should be async.");

			assert.ok(this.oDeprecatedAPISpy.notCalled,
				"Deprecated function should not be called internally");

		}.bind(this)).then(done);
	});

	QUnit.test("VersionInfo.load - Unknown library", function(assert) {
		var done = assert.async();

		this.initFakeServer();

		VersionInfo.load({
			library: "sap.invalid.library"
		}).then(function(oVersionInfo) {
			assert.equal(oVersionInfo, undefined, "Unknown library leads to undefined return value");

			assert.ok(this.oDeprecatedAPISpy.notCalled,
				"Deprecated function should not be called internally");

		}.bind(this)).then(done);
	});

	QUnit.test("VersionInfo.load - file not found", function(assert) {
		var done = assert.async();
		this.initFakeServer(404); // Make sure the request fails as 404 - Not found

		VersionInfo.load().then(function() {
			assert.ok(false, "Promise should not get resolved.");
		}, function(err) {

			// Check if exception is correct
			sinon.assert.match(err.message, sinon.match("resource sap-ui-version.json could not be loaded"),
				"Should give an error saying the file can not be found.");

			assert.strictEqual(sap.ui.versioninfo, undefined,
				"'sap.ui.versioninfo' should still be undefined after calling the function.");

			assert.strictEqual(this.oServer.requests.length, 1,
				"Server should have received one request.");
			assert.ok(this.oServer.requests[0].async,
				"Request should be async.");

			assert.ok(this.oDeprecatedAPISpy.notCalled,
				"Deprecated function should not be called internally");

		}.bind(this)).then(done);
	});

});