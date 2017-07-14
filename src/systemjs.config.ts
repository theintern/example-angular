SystemJS.config({
	baseURL: '/dist',
	paths: {
		'npm:': `/node_modules/`
	},

	map: {
		'dist': '.',
		'main': 'main',
		'app': 'app',
		'@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
		'@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
		'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
		'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
		'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
		'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
		'@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
		'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
		'@angular/http': 'npm:@angular/http/bundles/http.umd.js',
		'@angular/router': 'npm:@angular/router/bundles/router.umd.js',
		'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
		'rxjs': 'npm:rxjs',
		'sinon': 'npm:sinon/pkg/sinon.js',
		'sinon-chai': 'npm:sinon-chai/lib/sinon-chai.js',
		'tslib': 'npm:tslib/tslib.js'
	},

	packages: {
		app: {
			defaultExtension: 'js',
			meta: {
				'./*.js': {
					loader: 'systemjs-angular-loader.js'
				}
			}
		},

		dist: {
			defaultExtension: 'js',
			meta: {
				'./app/*.js': {
					loader: 'systemjs-angular-loader.js'
				}
			}
		},

		testing: {
			defaultExtension: 'js'
		},

		rxjs: {
			defaultExtension: 'js'
		}
	}
});
