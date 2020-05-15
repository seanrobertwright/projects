sap.ui.define([
    'lril/app/controllers/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'lril/app/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("lril.app.controllers.moc.MOC", {
        formatter: formatter,

        onInit: function (evt) {

            var sPath = jQuery.sap.getModulePath("lril.app", "/model/mocTiles.json");
            var oNavModel = new JSONModel(sPath);
            console.log("oNav:" + oNavModel);
            this.getView().setModel(oNavModel, "navtiles");

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