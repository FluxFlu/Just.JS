class jint {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => parseInt(e));
            } else {
                Object.defineProperty(this, "value", {
                    value: parseInt(value),
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
                this.value = this.value.map(e => parseInt(e));
            } else {
                this.value = parseInt(this.value);
            }
        }
    }
}
export {jint as default}