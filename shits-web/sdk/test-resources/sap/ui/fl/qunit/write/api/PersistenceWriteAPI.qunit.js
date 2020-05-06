/* global QUnit */

sap.ui.define([
	"sap/base/util/restricted/_omit",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/fl/apply/_internal/ChangesController",
	"sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory",
	"sap/ui/fl/write/api/FeaturesAPI",
	"sap/ui/fl/write/api/PersistenceWriteAPI",
	"sap/ui/fl/apply/_internal/changes/FlexCustomData",
	"sap/ui/fl/Layer",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon-4",
	"sap/base/Log"
], function(
	_omit,
	JsControlTreeModifier,
	ChangesController,
	DescriptorInlineChangeFactory,
	FeaturesAPI,
	PersistenceWriteAPI,
	FlexCustomData,
	Layer,
	jQuery,
	sinon,
	Log
) {
	"use strict";

	jQuery('#qunit-fixture').hide();
	var sandbox = sinon.sandbox.create();
	var sReturnValue = "returnValue";

	function mockFlexController(oControl, oReturn) {
		sandbox.stub(ChangesController, "getFlexControllerInstance")
			.throws("invalid parameters for flex persistence function")
			.withArgs(oControl)
			.returns(oReturn);
	}

	function mockDescriptorController(oControl, oReturn) {
		sandbox.stub(ChangesController, "getDescriptorFlexControllerInstance")
			.throws("invalid parameters for flex persistence function")
			.withArgs(oControl)
			.returns(oReturn);
	}

	function getMethodStub(aArguments, vReturnValue) {
		var fnPersistenceStub = sandbox.stub();
		fnPersistenceStub
			.throws("invalid parameters for flex persistence function")
			.withArgs.apply(fnPersistenceStub, aArguments)
			.returns(vReturnValue);
		return fnPersistenceStub;
	}

	QUnit.module("Given PersistenceWriteAPI", {
		beforeEach: function () {
			this.vSelector = {
				elementId: "selector",
				elementType: "sap.ui.core.Control",
				appComponent: {
					getId: function() {return "appComponent";}
				}
			};

			this.aObjectsToDestroy = [];

			this.oUIChangeSpecificData = {
				variantReference: "",
				fileName: "id_1445501120486_26",
				fileType: "change",
				changeType: "hideControl",
				reference: "reference.app.Component",
				packageName: "$TMP",
				content: {},
				selector: {
					id: "RTADemoAppMD---detail--GroupElementDatesShippingStatus"
				},
				layer:  Layer.CUSTOMER,
				texts: {},
				namespace: "reference.app.Component",
				creation: "2018-10-16T08:00:02",
				originalLanguage: "EN",
				conditions: {},
				support: {
					generator: "Change.createInitialFileContent",
					service: "",
					user: ""
				}
			};
		},
		afterEach: function() {
			sandbox.restore();
			delete this.vSelector;
		}
	}, function() {
		QUnit.test("when hasHigherLayerChanges is called", function(assert) {
			var mPropertyBag = {
				selector: "selector",
				mockParam: "mockParam"
			};

			var fnPersistenceStub = getMethodStub(mPropertyBag.parameters, Promise.resolve(sReturnValue));

			mockFlexController(mPropertyBag.selector, { hasHigherLayerChanges : fnPersistenceStub });

			return PersistenceWriteAPI.hasHigherLayerChanges(mPropertyBag)
				.then(function(sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called with correct parameters");
				});
		});

		QUnit.test("when save is called", function(assert) {
			var mPropertyBag = {};
			mPropertyBag.skipUpdateCache = true;
			mPropertyBag.selector = this.vSelector;

			var fnFlexStub = getMethodStub([mPropertyBag.skipUpdateCache], Promise.resolve());
			var fnDescriptorStub = getMethodStub([mPropertyBag.skipUpdateCache], Promise.resolve());

			mockFlexController(mPropertyBag.selector, { saveAll : fnFlexStub });
			mockDescriptorController(mPropertyBag.selector, { saveAll : fnDescriptorStub });

			sandbox.stub(PersistenceWriteAPI, "_getUIChanges")
				.withArgs(Object.assign({selector: mPropertyBag.selector, invalidateCache: true, componentId: "appComponent"}))
				.resolves(sReturnValue);

			return PersistenceWriteAPI.save(mPropertyBag)
				.then(function(sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called with correct parameters");
				});
		});

		QUnit.test("when save is called for a draft", function(assert) {
			var mPropertyBag = {};
			mPropertyBag.layer = Layer.CUSTOMER;
			mPropertyBag.selector = this.vSelector;
			mPropertyBag.draft = true;

			var fnFlexStub = getMethodStub([mPropertyBag.skipUpdateCache], Promise.resolve());
			var fnDescriptorStub = getMethodStub([mPropertyBag.skipUpdateCache], Promise.resolve());

			mockFlexController(mPropertyBag.selector, { saveAll : fnFlexStub });
			mockDescriptorController(mPropertyBag.selector, { saveAll : fnDescriptorStub });

			sandbox.stub(PersistenceWriteAPI, "_getUIChanges")
				.withArgs(Object.assign({selector: mPropertyBag.selector, invalidateCache: true, componentId: "appComponent"}))
				.resolves(sReturnValue);

			return PersistenceWriteAPI.save(mPropertyBag)
				.then(function() {
					var aFlexArgs = fnFlexStub.getCall(0).args;
					assert.equal(aFlexArgs[1], true, "then the draft flag was passed to the flex save operation");
					var aDescriptorArgs = fnDescriptorStub.getCall(0).args;
					assert.equal(aDescriptorArgs[1], true, "and the draft flag was passed to the descriptor save operation");
				});
		});

		QUnit.test("when reset is called", function(assert) {
			var mPropertyBag = {
				layer: Layer.CUSTOMER,
				generator: "generator",
				selectorIds: [],
				changeTypes: [],
				selector: this.vSelector
			};

			var oAppComponent = {id: "appComponent"};

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			var aArguments = [mPropertyBag.layer, mPropertyBag.generator, oAppComponent, mPropertyBag.selectorIds, mPropertyBag.changeTypes];
			var fnPersistenceStub = getMethodStub(aArguments, Promise.resolve(sReturnValue));

			mockFlexController(oAppComponent, { resetChanges : fnPersistenceStub });

			return PersistenceWriteAPI.reset(mPropertyBag)
				.then(function (sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called with correct parameters");
				});
		});

		QUnit.test("when publish is called", function(assert) {
			var mPropertyBag = {
				styleClass: "styleClass",
				layer: Layer.CUSTOMER,
				appVariantDescriptors: [],
				selector: this.vSelector
			};

			var oAppComponent = { id: "appComponent" };

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			var fnPersistenceStub = getMethodStub([
				{},
				mPropertyBag.styleClass,
				mPropertyBag.layer,
				mPropertyBag.appVariantDescriptors
			], Promise.resolve(sReturnValue));

			mockFlexController(oAppComponent, { _oChangePersistence: { transportAllUIChanges : fnPersistenceStub } });

			return PersistenceWriteAPI.publish(mPropertyBag)
				.then(function(sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called with correct parameters");
				});
		});

		QUnit.test("when publish is called without style class", function(assert) {
			var mPropertyBag = {
				layer: Layer.CUSTOMER,
				appVariantDescriptors: [],
				selector: this.vSelector
			};

			var oAppComponent = { id: "appComponent" };

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			var fnPersistenceStub = getMethodStub([
				{},
				"",
				mPropertyBag.layer,
				mPropertyBag.appVariantDescriptors
			], Promise.resolve(sReturnValue));

			mockFlexController(oAppComponent, { _oChangePersistence: { transportAllUIChanges : fnPersistenceStub } });

			return PersistenceWriteAPI.publish(mPropertyBag)
				.then(function(sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called with correct parameters");
				});
		});

		QUnit.test("when _getUIChanges is called", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector,
				invalidateCache: true
			};
			var fnPersistenceStub = getMethodStub([_omit(mPropertyBag, ["invalidateCache", "selector"]), mPropertyBag.invalidateCache], Promise.resolve(sReturnValue));

			mockFlexController(mPropertyBag.selector, { _oChangePersistence: { getChangesForComponent : fnPersistenceStub } });

			return PersistenceWriteAPI._getUIChanges(mPropertyBag)
				.then(function(sValue) {
					assert.strictEqual(sValue, sReturnValue, "then the flex persistence was called correctly");
				});
		});

		QUnit.test("when add is called with a flex change", function(assert) {
			var mPropertyBag = {
				change: {
					getChangeType: function() { return "flexChange"; }
				},
				selector: this.vSelector
			};
			var oAppComponent = {id: "appComponent"};

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			var fnPersistenceStub = getMethodStub([mPropertyBag.change, oAppComponent], sReturnValue);

			mockFlexController(oAppComponent, { addPreparedChange : fnPersistenceStub });

			assert.strictEqual(PersistenceWriteAPI.add(mPropertyBag), sReturnValue, "then the flex persistence was called with correct parameters");
		});

		QUnit.test("when add is called with a descriptor change", function(assert) {
			var done = assert.async();
			var sDescriptorChangeType = DescriptorInlineChangeFactory.getDescriptorChangeTypes()[0];
			var oChange = {
				_getMap: function() {
					return {
						changeType: sDescriptorChangeType
					};
				},
				store: function() {
					assert.ok(true, "then changes's store() was called");
					done();
				}
			};
			PersistenceWriteAPI.add({change: oChange, selector: this.vSelector});
		});

		QUnit.test("when add is called but an error is thrown", function(assert) {
			var sError = "mock error";
			var mPropertyBag = {
				change: {
					_getMap: function () {
						return {
							changeType: "whatever"
						};
					},
					getVariantReference: function () {
						throw new Error(sError);
					}
				},
				selector: this.vSelector
			};
			assert.throws(
				function() {
					PersistenceWriteAPI.add(mPropertyBag);
				},
				new Error(sError),
				"then an error is caught during the process"
			);
		});

		QUnit.test("when remove is called for a flex change", function(assert) {
			var mPropertyBag = {
				change: {
					getSelector: function () {
						return this.selector;
					}.bind(this),
					getChangeType: function () {
						return "";
					}
				},
				selector: this.vSelector
			};
			var oElement = { type: "element" };
			var oAppComponent = {id: "appComponent"};

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			sandbox.stub(JsControlTreeModifier, "bySelector")
				.withArgs(mPropertyBag.change.getSelector(), oAppComponent)
				.returns(oElement);

			var fnRemoveChangeStub = sandbox.stub(FlexCustomData, "destroyAppliedCustomData");
			var fnDeleteChangeStub = sandbox.stub();

			mockFlexController(oAppComponent, { deleteChange : fnDeleteChangeStub });

			PersistenceWriteAPI.remove(mPropertyBag);
			assert.ok(fnRemoveChangeStub.calledWith(oElement, mPropertyBag.change, JsControlTreeModifier), "then the flex persistence was called with correct parameters");
			assert.ok(fnDeleteChangeStub.calledWith(mPropertyBag.change, oAppComponent), "then the flex persistence was called with correct parameters");
		});

		QUnit.test("when remove is called for a flex change with an invalid selector", function(assert) {
			var mPropertyBag = {
				change: {
					getSelector: function () {
						return this.selector;
					}.bind(this)
				},
				selector: this.vSelector
			};

			sandbox.stub(ChangesController, "getAppComponentForSelector");

			var fnRemoveChangeStub = sandbox.stub(FlexCustomData, "destroyAppliedCustomData");
			var fnDeleteChangeStub = sandbox.stub();

			mockFlexController(undefined, { deleteChange : fnDeleteChangeStub });
			try {
				PersistenceWriteAPI.remove(mPropertyBag);
			} catch (oError) {
				assert.ok(oError instanceof Error, "then an error was thrown");
			}
			assert.ok(fnRemoveChangeStub.notCalled, "then the flex persistence was not called to delete change from control");
			assert.ok(fnDeleteChangeStub.notCalled, "then the flex persistence was not called to remove change from persistence");
		});

		QUnit.test("when remove is called for a flex change with an invalid app component", function(assert) {
			var mPropertyBag = {
				change: {
					getSelector: function () {
						return this.selector;
					}.bind(this)
				}
			};

			sandbox.stub(ChangesController, "getAppComponentForSelector");

			var fnRemoveChangeStub = sandbox.stub(FlexCustomData, "destroyAppliedCustomData");
			var fnDeleteChangeStub = sandbox.stub();

			mockFlexController(undefined, { deleteChange : fnDeleteChangeStub });
			try {
				PersistenceWriteAPI.remove(mPropertyBag);
			} catch (oError) {
				assert.ok(oError instanceof Error, "then an error was thrown");
			}
			assert.ok(fnRemoveChangeStub.notCalled, "then the flex persistence was not called to remove change from control");
			assert.ok(fnDeleteChangeStub.notCalled, "then the flex persistence was not called to delete change from persistence");
		});

		QUnit.test("when remove is called for a descriptor change", function(assert) {
			var sDescriptorChangeType = DescriptorInlineChangeFactory.getDescriptorChangeTypes()[0];
			var mPropertyBag = {
				change: {
					_getMap: function () {
						return {
							changeType: sDescriptorChangeType
						};
					}
				},
				selector: this.vSelector
			};

			var oAppComponent = {id: "appComponent"};

			sandbox.stub(ChangesController, "getAppComponentForSelector")
				.withArgs(mPropertyBag.selector)
				.returns(oAppComponent);

			var fnDeleteChangeStub = sandbox.stub();

			mockDescriptorController(oAppComponent, { deleteChange: fnDeleteChangeStub });

			PersistenceWriteAPI.remove(mPropertyBag);
			assert.ok(fnDeleteChangeStub.calledWith(mPropertyBag.change, oAppComponent), "then the flex persistence was called with correct parameters");
		});

		QUnit.test("get flex/info route is not available - client information will be used to determine reset + publish booleans", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.reject({status: 404, text: ""}));
			var oBaseLogStub = sandbox.stub(Log, "error");

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([{packageName: "transported"}]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.ok(oBaseLogStub.calledOnce, "an error was logged");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "flex/info isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info is not called for USER layer", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector,
				layer: Layer.USER
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.callCount, 0, "flex/info never called");
				assert.equal(oResetAndPublishInfo.isResetEnabled, false, "isResetEnabled is false");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info isResetEnabled, check hasChanges: persistence has NO changes, backend has changes", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, true, "flex/info called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "flex/info isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info isResetEnabled, check hasChanges: persistence has changes to reset, backend has NO changes to reset", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: false, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([this.oUIChangeSpecificData]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, false, "flex/info not called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, true, "flex/info isPublishEnabled is true");
			});
		});

		QUnit.test("get flex/info isResetEnabled, check hasChanges: persistence has NO changes to reset, backend has NO changes to reset", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: false, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, true, "flex/info called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, false, "flex/info isResetEnabled is false");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "flex/info isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info isPublishEnabled, check hasChangesToPublish: persistence has NO changes to publish, backend has changes to publish", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: true}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([{packageName: "transported"}]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, true, "flex/info called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, true, "flex/info isPublishEnabled is true");
			});
		});

		QUnit.test("get flex/info isPublishEnabled, check hasChangesToPublish: persistence has changes to publish, backend has NO changes to publish", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: false, isPublishEnabled: false}));
			mockFlexController(mPropertyBag.selector, { getResetAndPublishInfo: fnPersistenceStub });
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([this.oUIChangeSpecificData]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, false, "flex/info not called");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, true, "flex/info isPublishEnabled is true");
			});
		});

		QUnit.test("get flex/info isPublishEnabled, check hasChangesToPublish: persistence has NO changes to publish, backend has NO changes to publish", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: false, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, true, "flex/info called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, false, "flex/info isResetEnabled is false");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "flex/info isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info isPublishEnabled, check hasChangesToPublish: persistence has changes that are not yet published, backend has NO changes", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([this.oUIChangeSpecificData]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, false, "flex/info not called");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, true, "flex/info isPublishEnabled is true");
			});
		});

		QUnit.test("get flex/info isPublishEnabled, check hasChangesToPublish: persistence has changes that are all published, backend has NO changes to be published", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([{packageName: "transported"}, {packageName: "transported"}]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, true, "flex/info called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, false, "flex/info isPublishEnabled is false");
			});
		});

		QUnit.test("get flex/info with a change known by the client, which has packageName of an empty string", function(assert) {
			var mPropertyBag = {
				selector: this.vSelector
			};
			var fnPersistenceStub = getMethodStub([], Promise.resolve({isResetEnabled: true, isPublishEnabled: false}));

			mockFlexController(mPropertyBag.selector, {getResetAndPublishInfo: fnPersistenceStub});
			sandbox.stub(PersistenceWriteAPI, "_getUIChanges").withArgs(mPropertyBag).resolves([{packageName: ""}, {packageName: "transported"}]);
			sandbox.stub(FeaturesAPI, "isPublishAvailable").withArgs().resolves(true);

			return PersistenceWriteAPI.getResetAndPublishInfo(mPropertyBag).then(function (oResetAndPublishInfo) {
				assert.equal(fnPersistenceStub.calledOnce, false, "flex/info not called once");
				assert.equal(oResetAndPublishInfo.isResetEnabled, true, "flex/info isResetEnabled is true");
				assert.equal(oResetAndPublishInfo.isPublishEnabled, true, "flex/info isPublishEnabled is true");
			});
		});
	});
});
