import { Color } from "./color.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

    <div class = "color-card">
        <div id = "delete-card">×</div>
        <label for = "color-select">Select Color</label>
        <input id="color-select" type = "color">
    </div>
    <style>
        label[for="color-select"] {
            font-size: 12pt;
        }
        #color-select {
            width: 35px;
            height: 35px;
            display: block;
            margin: 1em auto;
			cursor:pointer;
        }
       .color-card {
		    border: 1px solid black;
            padding: 1em;
            width:150px;
            position: relative;
            background-color: #eee;
            border-radius: 20px;
       }

       #delete-card {
           position: absolute;
           top: -5px;
           right:10px;
           font-size: 36pt;
           user-select: none;
           cursor: pointer;
       }
    </style>
</div>
</nav>
`;

export class ColorCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this._colorInput = this.shadowRoot.querySelector("#color-select");
		this._colorCard = this.shadowRoot.querySelector(".color-card");
		this._xButton = this.shadowRoot.querySelector("#delete-card");
		this._color = new Color(255, 255, 255);
		this.setColor("#ffffff");
		console.log("Constructor");
	}

	connectedCallback() {
		const hexCode = this.getAttribute("hex-code");
		if (hexCode) {
			this.setColor(hexCode);
		}
		this._colorInput.onchange = _ => {
			this.setColor(this._colorInput.value);
		}
		this._xButton.onclick = _ => this.remove();
	}

	// sets the values of _r,_g, and _b and adjusts the color of the card
	setColor(hexCode) {
		this._colorInput.value = hexCode;
		let hexValue = parseInt(hexCode.substring(1), 16);
		this._color.b = hexValue % 0x100;
		hexValue >>= 8;
		this._color.g = hexValue % 0x100;
		this._color.r = hexValue >> 8;

		const lightness = 0.5;
		this._colorCard.style.backgroundColor = `rgb(${Math.round(this._color.r * (1 - lightness) + 255 * lightness)}, 
													 ${Math.round(this._color.g * (1 - lightness) + 255 * lightness)}, 
													 ${Math.round(this._color.b * (1 - lightness) + 255 * lightness)})`;
	}

	getColor() {
		return this._color;
	}

	//unbinds the navbar visibility toggle to the click event of the burger icon
	disconnectedCallback() {
		this._colorInput.onchange = null;
		this._xButton.onclick = null;
	}

	//returns the attributes that are observed
	static get observedAttributes() {
		return ["hex-code"];
	}
}

customElements.define('color-card', ColorCard);