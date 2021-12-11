class jboolean {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => !!e);
            } else {
                Object.defineProperty(this, "value", {
                    value: !!value,
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
                this.value = this.value.map(e => !!e);
            } else {
                this.value = !!this.value;
            }
        }
    }
}
export { jboolean as default }