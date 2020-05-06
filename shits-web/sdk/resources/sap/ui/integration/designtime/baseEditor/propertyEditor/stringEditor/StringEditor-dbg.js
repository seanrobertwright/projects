/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor",
	"sap/ui/integration/designtime/baseEditor/util/isValidBindingString"
], function (
	BasePropertyEditor,
	isValidBindingString
) {
	"use strict";

	/**
	 * @class
	 * Constructor for a new <code>StringEditor</code>.
	 * This allows to set string values or binding strings for a specified property of a JSON object.
	 * The editor is rendered as a {@link sap.m.Input}.
	 * To get notified about changes made with the editor, you can use the <code>attachValueChange</code> method,
	 * which passes the current property state as a string or binding string to the provided callback function when the user edits the input.
	 *
	 * <h3>Configuration</h3>
	 *
	 * <table style="width:100%;">
	 * <tr style="text-align:left">
	 * 	<th>Option</th>
	 * 	<th>Type</th>
	 * 	<th>Default</th>
	 * 	<th>Description</th>
	 * </tr>
	 * <tr>
	 * 	<td><code>enabled</code></td>
	 *  <td><code>boolean</code></td>
	 * 	<td><code>true</code></td>
	 * 	<td>Whether the underlying control should be enabled</td>
	 * </tr>
	 * </table>
	 *
	 * @extends sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor
	 * @alias sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor
	 * @author SAP SE
	 * @since 1.70
	 * @version 1.76.0
	 *
	 * @private
	 * @experimental 1.70
	 * @ui5-restricted
	 */
	var StringEditor = BasePropertyEditor.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor", {
		xmlFragment: "sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor",
		renderer: BasePropertyEditor.getMetadata().getRenderer().render
	});

	StringEditor.prototype.setValue = function (vValue) {
		if (vValue != null) {
			vValue = vValue.toString();
		}
		BasePropertyEditor.prototype.setValue.call(this, vValue);
	};

	StringEditor.prototype._onLiveChange = function () {
		var oInput = this.getContent();
		if (this._validate()) {
			this.setValue(oInput.getValue());
		}
	};

	StringEditor.prototype._validate = function () {
		var oInput = this.getContent();
		var sValue = oInput.getValue();
		if (!isValidBindingString(sValue)) {
			oInput.setValueState("Error");
			oInput.setValueStateText(this.getI18nProperty("BASE_EDITOR.STRING.INVALID_BINDING"));
			return false;
		} else {
			oInput.setValueState("None");
			return true;
		}
	};

	return StringEditor;
});
