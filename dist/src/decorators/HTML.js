function HTML(contentOrFilename) {
    console.log('Decorator : HTML : Outer');
    return function () {
        console.log('Decorator : HTML : Inner');
    };
}
export default HTML;
export { HTML };
