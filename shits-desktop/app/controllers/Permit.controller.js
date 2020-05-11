sap.ui.define([
    'lril/app/controllers/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'lril/app/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("lril.app.controllers.Permit", {
        formatter: formatter,

        onInit: function () {
            var oViewModel = new JSONModel({
                isPhone : Device.system.phone
            });
            this.setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        }
    });
});