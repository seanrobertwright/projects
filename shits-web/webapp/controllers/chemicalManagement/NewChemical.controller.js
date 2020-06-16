sap.ui.define([
    'lril/app/controllers/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'lril/app/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("lril.app.controllers.chemicalManagement.NewChemical", {
        formatter: formatter,

        onInit: function () {
            var today = new Date();
            this.byId("requestID").setValue(Date.now());

            var dd = String(today.getDate()).padStart(2,'0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            this.byId("requestDate").setValue(today);
            console.log(today);

            // Get Dropdown data from REST API
           var oSelectModel = new sap.ui.model.JSONModel();
           oSelectModel.loadData("http://localhost:3000/explorer/#/costcenters", null, true, 'GET');
           sap.ui.getCore().setModel(oSelectModel, "costCenters");
            
            /** var oData = {
                "CostCenterCollection": [
                    {
                        "Number": "3251889484",
                        "Name": "TCS GLOBAL IN NA"
                    },
                    {
                        "Number": "3252669484",
                        "Name": "AG PD RH - EQUIPMENT"
                    },
                    {
                        "Number": "3252779484",
                        "Name": "AG PD RH - ADHESIVES"
                    }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel); **/
        }
    });
});