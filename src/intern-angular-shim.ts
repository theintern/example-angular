intern.registerPlugin('angular-shim', async () => {
	async function initTestEnv() {
		const { TestBed } = await SystemJS.import('@angular/core/testing');
		const { BrowserDynamicTestingModule, platformBrowserDynamicTesting } = await SystemJS.import('@angular/platform-browser-dynamic/testing');

		TestBed.initTestEnvironment(
			BrowserDynamicTestingModule,
			platformBrowserDynamicTesting()
		);

		intern.on('suiteAdd', suite => {
			suite['afterEach'] = () => {
				TestBed.resetTestingModule();
			};
		});

		const sinonChai = await SystemJS.import('sinon-chai');
		intern.getPlugin('chai').use(sinonChai);
	}

	await intern.loadScript('dist/systemjs.config.js');

	SystemJS.config({
		map: {
			'@angular/animations/browser/testing': 'npm:@angular/animations/bundles/animations-browser-testing.umd.js',
			'@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
			'@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
			'@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
			'@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
			'@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
			'@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
			'@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
			'@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js'
		}
	});

	await intern.loadScript([
		'node_modules/core-js/client/shim.js',
		'node_modules/zone.js/dist/zone.js',
		'node_modules/zone.js/dist/long-stack-trace-zone.js'
	]);
	await initTestEnv();
});
