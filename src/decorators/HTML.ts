function HTML(contentOrFilename: string):any {
	console.log('Decorator : HTML : Outer');
	
	return function():any {
		console.log('Decorator : HTML : Inner');

	}; 
}

export default HTML;
export { HTML };