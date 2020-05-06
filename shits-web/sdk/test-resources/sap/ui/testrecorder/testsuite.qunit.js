sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/Device"
], function(merge, Device) {
	"use strict";

	var oTests = {
		"qunit/inspector/ControlAPI": {
			title: "QUnit Page for sap.ui.testrecorder.inspector.ControlAPI",
			module: "./qunit/inspector/ControlAPI.qunit"
		},
		"qunit/controlSelectors/ControlSelectorGenerator": {
			title: "QUnit Page for sap.ui.testrecorder.controlSelectors.ControlSelectorGenerator",
			module: "./qunit/controlSelectors/ControlSelectorGenerator.qunit"
		},
		"qunit/codeSnippets/POMethodUtil": {
			title: "QUnit Page for sap.ui.testrecorder.controlSelectors.POMethodUtil",
			module: "./qunit/codeSnippets/POMethodUtil.qunit"
		},
		"qunit/codeSnippets/CodeSnippetProvider": {
			title: "QUnit Page for sap.ui.testrecorder.controlSelectors.CodeSnippetProvider",
			module: "./qunit/codeSnippets/CodeSnippetProvider.qunit"
		},
		"qunit/inspector/ControlInspector": {
			title: "QUnit Page for sap.ui.testrecorder.controlSelectors.ControlInspector",
			module: "./qunit/inspector/ControlInspector.qunit"
		},
		"qunit/inspector/ControlInspectorRepo": {
			title: "QUnit Page for sap.ui.testrecorder.controlSelectors.ControlInspectorRepo",
			module: "./qunit/inspector/ControlInspectorRepo.qunit"
		}
	};

	var oTestSuite = {
		name: "TestSuite for sap.ui.core: GTP testcase CORE/TEST RECORDER",
		defaults: {
			qunit: {
				noglobals: false
			},
			sinon: {
				version: 1,
				qunitBridge: true
			},
			ui5: {
				animation: false
			},
			autostart: true
		},
		tests: {
			"integration/opaTests": {
				page: "test-resources/sap/ui/testrecorder/integration/opaTests.qunit.html?noglobals=true&sap-ui-animation=false",
				title: "QUnit Page for sap.ui.testrecorder OPA tests",
				loader: {
					paths: {
						"sap/ui/testrecorder/integration": "test-resources/sap/ui/testrecorder/integration",
						"sap/ui/testrecorder/recorderMock": "test-resources/sap/ui/testrecorder/recorderMock",
						"sap/ui/testrecorder/appMock": "test-resources/sap/ui/testrecorder/appMock",
						"sap/ui/testrecorder/fixture": "test-resources/sap/ui/testrecorder/fixture"
					}
				},
				autostart: false
			}
		}
	};

	Object.keys(oTests).forEach(function (name) {
		oTestSuite.tests[name + "1"] = merge({}, oTests[name], {qunit: { version: 1 }});
		oTestSuite.tests[name + "2"] = merge({}, oTests[name], {qunit: { version: 2 }});

		if (oTestSuite.tests[name + "2"].title) {
			oTestSuite.tests[name + "2"].title += " (QUnit 2)";
		}
	});

	return oTestSuite;
});
