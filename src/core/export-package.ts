import のーど from './node';
import exportNodes from './export';

export default function(nodes: Set<のーど>, author: string, name: string, desc: string) {
	if (Array.from(nodes).find(n => n.type === 'PackageInput') == null || Array.from(nodes).find(n => n.type === 'PackageOutput') == null) {
		throw 'パッケージを作成するには、回路に一つ以上のPackageInputおよびPackageOutputが含まれている必要があります' + '\n' + 'To create a package, you must include PackageInput and PackageOutput.';
	}

	const data = {
		type: 'Package',
		packageName: name,
		packageDesc: desc,
		packageAuthor: author,
		nodes: exportNodes(nodes)
	};

	return data;
}
