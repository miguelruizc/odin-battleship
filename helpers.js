export function clearTextContent(div) {
	let childNodes = div.childNodes;
	childNodes.forEach((node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			node.textContent = '';
		}
	});
}
