export class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
    //returns a brightness value in the range 0-1
	brightness() {
		return 0.299 * (this.r * this.r)/0x10000 + 0.587 * (this.g * this.g)/0x10000 + 0.114 * (this.b * this.b)/0x10000;
	}
	getCSSColor() {
		return `rgb(${this.r},${this.g},${this.b})`;
	}
}
