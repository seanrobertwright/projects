
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/core/Control',
	'sap/uxap/ObjectPageSubSection'
], function(Control, ObjectPageSubSection) {
	"use strict";

	/**
	 * @class
	 * Custom ObjectPageSubSection control which internally does not uses Grid control.
	 * @extends sap.uxap.ObjectPageSubSection
	 * @private
	 * @ui5-restricted sdk
	 */
	var SDKObjectPageSubSection = ObjectPageSubSection.extend("sap.ui.documentation.sdk.controls.ObjectPageSubSection", {
		metadata: {
			library: "sap.ui.documentation"
		},
		renderer: "sap.uxap.ObjectPageSubSectionRenderer"
	});

	var Container = new Control.extend("Container", {
		metadata: {
			aggregations: {
				content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"}
			}
		},

		renderer: {
			apiVersion: 2,

			render: function (oRm, oControl) {
			var aContent = oControl.getContent(),
				iLen,
				i;

			oRm.openStart("div").openEnd();

			for (i = 0, iLen = aContent.length; i < iLen; i++) {
				oRm.renderControl(aContent[i]);
			}

			oRm.close("div");
		}
	}});

	SDKObjectPageSubSection.prototype._getGrid = function () {
		if (!this.getAggregation("_grid")) {
			this.setAggregation("_grid", new Container({
				id: this.getId() + "-innerGrid"
			}), true); // this is always called onBeforeRendering so suppress invalidate
		}

		return this.getAggregation("_grid");
	};

	return SDKObjectPageSubSection;
});