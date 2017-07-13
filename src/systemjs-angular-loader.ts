const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

export function translate(load: { source: string; address: string; }) {
	if (load.source.indexOf('moduleId') !== -1) {
		return load;
	}

	const url = document.createElement('a');
	url.href = load.address;

	const basePathParts = url.pathname.split('/');

	basePathParts.pop();
	let basePath = basePathParts.join('/');

	const baseHref = document.createElement('a');
	baseHref.href = this.baseURL;

	if (!baseHref.pathname.startsWith('/dist/')) {
		basePath = basePath.replace(baseHref.pathname, '');
	}

	load.source = load.source
		.replace(templateUrlRegex, function(_, __, resolvedUrl){
			if (resolvedUrl.startsWith('.')) {
				resolvedUrl = basePath + resolvedUrl.substr(1);
			}

			return `templateUrl: "${resolvedUrl}"`;
		})
		.replace(stylesRegex, function(_, relativeUrls) {
			const urls = [];
			let match: RegExpExecArray;

			while ((match = stringRegex.exec(relativeUrls)) !== null) {
				if (match[2].startsWith('.')) {
					urls.push(`"${basePath}${match[2].substr(1)}"`);
				} else {
					urls.push(`"${match[2]}"`);
				}
			}

			return `styleUrls: [${urls.join(', ')}]`;
		});

		return load;
}
