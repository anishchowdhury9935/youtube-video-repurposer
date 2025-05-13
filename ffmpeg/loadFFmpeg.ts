
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
const loadFFmpeg = async () => {
	const newFFmpeg = new FFmpeg();
	const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

	newFFmpeg.on("log", ({ message }) => {
		// if (messageRef.current) {
		// 	messageRef.current.textContent = message;
		// }
		console.log(message);
	});

	await newFFmpeg.load({
		coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
		wasmURL: await toBlobURL(
			`${baseURL}/ffmpeg-core.wasm`,
			"application/wasm",
		),
	});
	return { newFFmpeg };
};

export default loadFFmpeg;
