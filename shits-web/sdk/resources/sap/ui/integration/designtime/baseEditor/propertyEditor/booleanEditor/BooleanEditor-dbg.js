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
	 * Constructor for a new <code>BooleanEditor</code>.
	 * This allows you to set boolean values or binding strings for a specified property of a JSON object.
	 * The editor is rendered as a {@link sap.m.ComboBox}.
	 * To get notified about changes made with the editor, you can use the <code>attachValueChange</code> method,
	 * which passes the current property state as a boolean or binding string to the provided callback function when the state changes.
	 *
	 * @extends sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor
	 * @alias sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor
	 * @author SAP SE
	 * @since 1.72
	 * @version 1.76.0
	 *
	 * @private
	 * @experimental 1.72
	 * @ui5-restricted
	 */
	var BooleanEditor = BasePropertyEditor.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor", {
		xmlFragment: "sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",

		_onChange: function() {
			var bInput = this._validate();
			if (bInput !== null) {
				this.setValue(bInput);
			}
		},

		_validate: function() {
			var oComboBox = this.getContent();
			var sSelectedKey = oComboBox.getSelectedKey();
			var sValue = oComboBox.getValue();

			if (sValue && !sSelectedKey && !isValidBindingString(sValue, false)) {
				oComboBox.setValueState("Error");
				oComboBox.setValueStateText(this.getI18nProperty("BASE_EDITOR.BOOLEAN.INVALID_BINDING_OR_BOOLEAN"));
				return null;
			}

			oComboBox.setValueState("None");
			if (sSelectedKey) {
				return sSelectedKey === "true";
			}
			return sValue;
		},
		renderer: BasePropertyEditor.getMetadata().getRenderer().render
	});

	return BooleanEditor;
});
