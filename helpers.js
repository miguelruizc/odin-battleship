export function clearTextContent(div) {
	let childNodes = div.childNodes;
	childNodes.forEach((node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			node.textContent = '';
		}
	});
}

export function findShipCells(initialRow, initialCol, shipSize, direction) {
	let array = [];

	for (let i = 0; i < shipSize; i++) {
		if (direction === 'horizontal') {
			array.push({ row: initialRow, col: initialCol + i });
		} else if (direction === 'vertical') {
			array.push({ row: initialRow + i, col: initialCol });
		} else console.log('Invalid direction');
	}

	return array;
}

export function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
