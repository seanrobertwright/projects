sap.ui.define(['sap/ui/core/Core', 'sap/ui/core/library'], function(Core, coreLib) {
	"use strict";
	sap.ui.getCore().initLibrary({
		name: 'testlibs.scenario13.lib1',
		dependencies: [
			'testlibs.scenario13.lib3',
			'testlibs.scenario13.lib4',
			'testlibs.scenario13.lib5'
		],
		noLibraryCSS: true
	});
	return testlibs.scenario13.lib1; // eslint-disable-line no-undef
});