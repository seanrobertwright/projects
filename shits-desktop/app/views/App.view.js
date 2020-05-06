sap.ui.jsview("lril.app.App", {
    getControllerName: function() {
        return "lril.app.controller.App";
    },

    createContent: function(oController) {
        var oButton = new sap.m.Button({text:"Hello"});
        oButton.attachPress(oController.handleButtonClicked);
        return oButton;
    }
});