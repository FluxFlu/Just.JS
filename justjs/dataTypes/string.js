class jstring {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => e.toString());
            } else {
                Object.defineProperty(this, "value", {
                    value: value.toString(),
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    evaluated() {
        this.updateValue();
        return this;
    }
    updateValue() {
        if (this.type != 'const') {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => e.toString());
            } else {
                this.value = this.value.toString();
            }
        }
    }
}
export {jstring as default}