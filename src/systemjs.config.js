(function (global) {
	SystemJS.config({
		paths: {
			'npm:': SystemJS.baseURL + '../node_modules/'
		},

		map: {
			'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
			'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
			'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
			'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
			'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
			'@angular/http': 'npm:@angular/http/bundles/http.umd.js',
			'@angular/router': 'npm:@angular/router/bundles/router.umd.js',
			'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
			'rxjs': 'npm:rxjs',
			'sinon': 'npm:sinon'
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

			'dist': {
				defaultExtension: 'js',
				meta: {
					'./*.js': {
						loader: 'systemjs-angular-loader.js'
					}
				}
			},

			rxjs: {
				defaultExtension: 'js'
			},

			sinon: {
				defaultExtension: 'js',
				main: 'pkg/sinon.js'
			}
		}
	});
})(this);
