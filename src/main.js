import { ColorCard } from "./color-card.js";
import { drawPortrait } from "./canvas.js";

let img;

document.querySelector("#image-upload").onchange = e => {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file); // this is reading as data url
	reader.onload = readerEvent => {
		img = new Image();
		img.src = readerEvent.target.result;
		const bricksWide = document.querySelector("#cubie-width").value || 60;
		const stickerSize = document.querySelector("#sticker-size").value;
		img.onload = _ => drawPortrait(img, bricksWide, stickerSize);
	}
}

document.querySelector("#sticker-size").oninput = updatePortrait;
document.querySelector("#cubie-width").oninput = updatePortrait;
document.querySelectorAll("color-card").forEach(element => element.addEventListener("colorChange", updatePortrait));

function updatePortrait() {
	if (!img) {
		return;
	}
	const bricksWide = document.querySelector("#cubie-width").value || 60;
	const stickerSize = document.querySelector("#sticker-size").value;
	drawPortrait(img, bricksWide, stickerSize);
}

document.querySelector("#add-card").onclick = _ => {
	const newCard = document.createElement("color-card");
	newCard.addEventListener("colorChange", updatePortrait);
	newCard.setColor("#888888");
	document.querySelector("#color-card-area").appendChild(newCard);
	updatePortrait();
};
