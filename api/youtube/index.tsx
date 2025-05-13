import helperFunction from "@/helper/helper";
import config from "@/config.js";

export default function youtubeHelper() {
	const { tryCatch } = helperFunction();
	const index = {
		getYtVideoUrl: async (ytUrl: string) => {
			return tryCatch(async () => {
				const url = `${config.api.baseURL}/youtube/get/videoUrl`;
				console.log("ytUrl", ytUrl);
				const data = {
					ytUrl,
				};
				const response = await fetch(url, {
					method: "post",
					headers: {
						"content-type": "application/json",
						authorization: `${localStorage.getItem("token")}`,
					},
					body: JSON.stringify(data),
				});
				const value = await response.json();
				if (value.error === undefined) {
					return value.ytVideoUrl;
				}
				return null;
			});
		},
		getTrimVideo: async (           // todo need to be fixe this function
			videoId: string,
			clips: Array<{ start: number; end: number }>,
		) => {
				const url = `${config.api.baseURL}/youtube/get/trimVideo`;
				const data = {
					videoUrl: videoId,
					startTime: clips[0].start,
					endTime: clips[0].end,
				};
				const response = await fetch(
					`${config.api.baseURL}/video/edit/trim-video`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							authorization: `${localStorage.getItem("token")}`,
						},
						body: JSON.stringify({
							...data,
						}),
					},
				);
				const value = await response.json();
				return response;
		},
	};
	return {
		...index,
	};
}
