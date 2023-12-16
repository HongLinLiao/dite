interface String {
    isTruthy(): boolean;
}

String.prototype.isTruthy = function () {
    const convertor = this.trim().toLowerCase();
    return !(convertor === 'false' || convertor === '0' || convertor === '');
};
