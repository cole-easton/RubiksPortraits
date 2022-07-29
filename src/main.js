import { ColorCard } from "./color-card.js";
import { Color } from './color.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


document.querySelector("#image-upload").onchange = e => {
	const file = e.target.files[0];

	const reader = new FileReader();
	reader.readAsDataURL(file); // this is reading as data url

	reader.onload = readerEvent => {
		const img = new Image();
		img.src = readerEvent.target.result;
		img.onload = imgEvent => {
			ctx.fillStyle = "red";
			ctx.fillRect(0, 0, 100, 100);
			canvas.style.display = "block";
			canvas.width = img.width;
			canvas.height = img.height;
			document.querySelector("body").appendChild(img); //for some reason it doesn't work without this
			ctx.drawImage(img, 0, 0);

			let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			let data = imageData.data;
			let length = data.length;
			let width = imageData.width;

			const bricksWide = 60;
			const pixelsPerBrick = Math.floor(canvas.width / bricksWide);
			canvas.width = bricksWide * pixelsPerBrick;
			const bricksTall = Math.floor(bricksWide * canvas.height / canvas.width);
			canvas.height = bricksTall * pixelsPerBrick;

			const colors = Array.from(document.querySelectorAll("color-card")).map(colorCard => colorCard.getColor());
			colors.sort((c1, c2) => c1.brightness() - c2.brightness()); //ascending order of brightness
			const brightnesses = [];
			for (let brickX = 0; brickX < bricksWide; brickX++) {
				for (let brickY = 0; brickY < bricksTall; brickY++) {
					const xEnd = pixelsPerBrick * (brickX + 1); //to avoid computing each frame
					let cumulativeBrightness = 0;
					for (let x = pixelsPerBrick * brickX; x < xEnd; x++) {
						const yEnd = pixelsPerBrick * (brickY + 1)
						for (let y = pixelsPerBrick * brickY; y < yEnd; y++) {
							let i = (y * width + x) * 4;
							let red = data[i], green = data[i + 1], blue = data[i + 2];
							cumulativeBrightness += new Color(red, green, blue).brightness();
						}
					}
					cumulativeBrightness = cumulativeBrightness / (pixelsPerBrick * pixelsPerBrick);
					brightnesses.push(cumulativeBrightness);
				}
			}
			const sortedBrightnesses = [...brightnesses];
			sortedBrightnesses.sort((a, b) => a - b);
			for (let brickX = 0; brickX < bricksWide; brickX++) {
				for (let brickY = 0; brickY < bricksTall; brickY++) {
					const xEnd = pixelsPerBrick * (brickX + 1); //to avoid computing each frame
					const brightness = brightnesses.shift();
					let indexOfFirstBrighterColor = 0;
					while (indexOfFirstBrighterColor < colors.length && brightness > sortedBrightnesses[Math.round(indexOfFirstBrighterColor * sortedBrightnesses.length / colors.length)]) {
						indexOfFirstBrighterColor++;
					}
					let color;
					if (indexOfFirstBrighterColor === 0) {
						color = colors[0];
					}
					else if (indexOfFirstBrighterColor === colors.length) {
						color = colors[colors.length - 1];
					}
					else {
						const t = (Math.sqrt(brightness) - Math.sqrt(colors[indexOfFirstBrighterColor - 1].brightness()))
							/ (Math.sqrt(colors[indexOfFirstBrighterColor].brightness()) - Math.sqrt(colors[indexOfFirstBrighterColor - 1].brightness()));
						if (Math.random() < t)
							color = colors[indexOfFirstBrighterColor];
						else
							color = colors[indexOfFirstBrighterColor - 1];
					}
					ctx.fillStyle = color.getCSSColor();
					ctx.strokeStyle = "black";
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.rect(brickX * pixelsPerBrick, brickY * pixelsPerBrick, pixelsPerBrick, pixelsPerBrick);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
				}
			}
		}
	}
}

document.querySelector("#add-card").onclick = _ => {
	const newCard = document.createElement("color-card");
	newCard.setColor("#888888");
	document.querySelector("#color-card-area").appendChild(newCard);
};
