"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Loader2,
	Youtube,
	FileVideo,
	Send,
	CheckCircle2,
	Scissors,
	Plus,
	PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import youtubeApi from "@/api/youtube/index";
import { Slider } from "@/components/ui/slider";
import useAuth from "@/components/authorize";
import config from "@/config";

//  Functions to Modify
// ----------------------
/**
 * Cuts a video into multiple clips based on the provided start and end times.
 *
 * @param videoId The ID or URL of the video to cut.
 * @param clips An array of objects, where each object defines the start and end
 * times (in seconds) for a clip.
 * @returns A promise that resolves to an object containing an array of clip identifiers
 * (e.g., file paths or URLs).
 *
 */
const cutVideoClips = async (
	videoId: string,
	clips: { start: number; end: number }[],
): Promise<{ clipIds: string[] }> => {
	//  Replace this with your actual video cutting implementation using a library
	//  like ffmpeg or a cloud-based video editing service.
	//  Example (Conceptual using a hypothetical library):
	//  const clipFiles = await cutVideo(videoId, clips);
	//  return { clipIds: clipFiles.map(file => file.path) };

	//  Simulate server-side cutting (replace with actual server call)
	// await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing delay

	if (!videoId || clips.length === 0) {
		return { clipIds: [] };
	}

	try {
		const response = await fetch(
			`${config.api.baseURL}/video/edit/trim-video`,
			{
				//  Corrected URL
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"authorization": `${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					// Changed the request body to match your expected format
					videoUrl: videoId,
					startTime: clips[0].start, // Assuming you're sending one clip at a time.
					endTime: clips[0].end,
				}),
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Trimming failed on the server: ${errorData.error || response.statusText}`,
			);
		}

		// Check the content type of the response
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.startsWith("application/json")) {
			// If it's JSON, parse it as before
			const data = await response.json();
			console.log("Server Response (JSON):", data);
			return { clipIds: data.clipUrls };
		} else if (contentType && contentType.startsWith("video/")) {
			// If it's a video, create a blob URL
			const blob = await response.blob();
			const videoUrl = URL.createObjectURL(blob);
			console.log("Server Response (Video):", videoUrl);
			return { clipIds: [videoUrl] }; // Return the URL in the expected format
		} else {
			// Handle other content types or errors
			// throw new Error(`Unexpected content type: ${contentType}`);
			console.error("Unexpected content type:", contentType);
		}
	} catch (error: any) {
		console.error("Error during server-side video trimming:", error);
	}
};

/**
 * Posts a video to multiple social media platforms.
 *
 * @param clips Array of clip identifiers (e.g., file paths or URLs) to post.
 * @param hook The hook text for the video.
 * @param header The header text for the video.
 * @param captions The captions for the video.
 * @param platforms An array of platforms to post to (e.g., ['tiktok', 'youtube_shorts', 'instagram_reels']).
 * @param accounts An array of account identifiers (corresponding to the platforms).
 * The length of accounts should be a multiple of the length of platforms
 * @returns A promise that resolves to an object indicating the success of the posting operation.
 * Example: { success: true }
 */
const postToPlatformsData = async (
	clips: string[],
	hook: string,
	header: string,
	captions: string,
	platforms: string[],
	accounts: string[],
): Promise<{ success: boolean }> => {
	// Replace this with your actual implementation using the APIs of the
	// target social media platforms (TikTok, YouTube, Instagram).
	// This will involve handling authentication, API requests, and error handling
	// for each platform.
	// Example (Conceptual using TikTok API):
	// for (let i = 0; i < platforms.length; i++) {
	//   const platform = platforms[i];
	//   const account = accounts[i]; // Or calculate the account
	//   await uploadVideo(platform, account, clip, { hook, header, captions });
	// }
	await new Promise((resolve) => setTimeout(resolve, 3000));
	if (
		clips.length === 0 ||
		!hook ||
		!header ||
		!captions ||
		platforms.length === 0 ||
		accounts.length === 0
	) {
		throw new Error("Missing information to post");
	}
	return { success: true };
};

// Animation variants
const cardVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeInOut" },
	},
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const VideoRepurposerApp = () => {
	const { getYtVideoUrl } = youtubeApi();
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [duration, setDuration] = useState(0); // Total video duration
	const [clips, setClips] = useState<{ start: number; end: number }[]>([]);
	const [newClipRange, setNewClipRange] = useState<[number, number]>([0, 0]); // For the slider
	const [platforms, setPlatforms] = useState<string[]>([]);
	const [accounts, setAccounts] = useState<string[]>([]);
	const [loading, setLoading] = useState<string | null>(null); // Track loading state for each operation
	const [error, setError] = useState<string | null>(null);
	const [isPosted, setIsPosted] = useState(false); // Track successful posting
	const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null); // To store the trimmed video URL
	const [selectedClipIndex, setSelectedClipIndex] = useState<number | null>(
		null,
	); // To store the selected clip index
	const {isAuth} = useAuth()

	const playerRef = useRef<HTMLVideoElement>(null);

	const handleExtractVideo = useCallback(async () => {
		setLoading("extract");
		setError(null);
		try {
			const res = await getYtVideoUrl(youtubeUrl); // Get title from the function
			setVideoUrl(res);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(null);
		}
	}, [youtubeUrl]);

	const handleAddClip = () => {
		const start = newClipRange[0];
		const end = newClipRange[1];
		if (start < end) {
			setClips([...clips, { start, end }]);
			setNewClipRange([0, duration]); // Reset slider
		} else {
			setError("Invalid clip times. Start must be less than end.");
		}
	};

	const handleCutClips = useCallback(async () => {
		setLoading("cut");
		setError(null);
		try {
			if (selectedClipIndex === null) {
				throw new Error("Please select a clip to cut.");
			}
			const { clipIds } = await cutVideoClips(videoUrl, [
				clips[selectedClipIndex],
			]); // Get clipIds from server
			if (clipIds && clipIds.length > 0) {
				setTrimmedVideoUrl(clipIds[0]); // set the first trimmed video.
			}

			// In a real app, you'd store these clip IDs or paths
			console.log("Clips cut:", clipIds);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(null);
		}
	}, [clips, videoUrl, selectedClipIndex]);

	const handlePost = useCallback(async () => {
		setLoading("post");
		setError(null);
		try {
			const { success } = await postToPlatformsData(
				// Get success
				clips.map((_, i) => `clip_${i + 1}`), // Mock clip IDs
				"mock hook",
				"mock header",
				"mock captions",
				platforms,
				accounts,
			);
			if (success) {
				setIsPosted(true);
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(null);
		}
	}, [clips, platforms, accounts]);

	const handleDuration = (loadedDuration: number) => {
		setDuration(loadedDuration);
		setNewClipRange([0, loadedDuration]); // Initialize slider range
	};

	useEffect(() => {
		if (playerRef.current) {
			playerRef.current.onloadedmetadata = () => {
				handleDuration(playerRef.current!.duration);
			};
		}
		
	}, [videoUrl]);

	// Animation variants for status messages
	const statusVariants = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-8">
			<div className="max-w-4xl mx-auto space-y-8">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
					YouTube to Short-Form Video Repurposer
				</h1>

				<AnimatePresence>
					{error && (
						<motion.div
							variants={statusVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className="bg-red-500/20 text-red-400 p-4 rounded-lg border border-red-500/30 shadow-lg"
						>
							<div className="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-6 w-6"
								>
									<path d="M21.73 18a2 2 0 0 1-1.73 1H3.73a2 2 0 0 1-1.73-1l8-14a2 2 0 0 1 3.46 0l8 14z" />
									<line x1="12" y1="9" x2="12" y2="13" />
									<line x1="12" y1="17" x2="12.01" y2="17" />
								</svg>
								<span className="font-medium">Error:</span> {error}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{isPosted && (
						<motion.div
							variants={statusVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className="bg-green-500/20 text-green-400 p-4 rounded-lg border border-green-500/30 shadow-lg"
						>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-6 w-6" />
								<span className="font-medium">Success!</span> Your video has
								been posted to all selected platforms.
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<Card className="bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-white text-lg flex items-center gap-2">
							<Youtube className="h-5 w-5" />
							1. Extract Video from YouTube
						</CardTitle>
						<CardDescription className="text-gray-400">
							Enter the YouTube URL to extract video information.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<Input
								type="text"
								placeholder="Enter YouTube URL"
								value={youtubeUrl}
								onChange={(e) => setYoutubeUrl(e.target.value)}
								className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
							/>
							<Button
								onClick={handleExtractVideo}
								disabled={loading === "extract"}
								className={cn(
									"w-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white hover:from-purple-500 to-blue-500",
									"hover:scale-105 transition-all duration-300 shadow-lg",
									loading === "extract" && "opacity-70 cursor-not-allowed",
								)}
							>
								{loading === "extract" ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Extracting...
									</>
								) : (
									"Extract Video"
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-white text-lg flex items-center gap-2">
							<FileVideo className="h-5 w-5" />
							2. Select Video Clips
						</CardTitle>
						<CardDescription className="text-gray-400">
							Trim the video into clips.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 display flex flex-col items-center">
						{videoUrl ? (
							<div className="relative w-full max-w-[600px]">
								<video
									style={{ maxHeight: "500px", width: "100%" }}
									ref={playerRef}
									src={videoUrl}
									controls
									className="rounded-lg shadow-lg mb-4 w-full max-w-[600px]"
									onLoadedMetadata={() => {
										if (playerRef.current) {
											handleDuration(playerRef.current.duration);
										}
									}}
								/>
								{duration > 0 && (
									<div className="w-full max-w-[600px]">
										<Slider
											min={0}
											max={duration}
											step={0.1} // Allow fine-grained selection
											value={newClipRange}
											onValueChange={setNewClipRange}
											className="mb-4"
											range
										/>
										<div className="flex justify-between text-sm text-gray-400">
											<span>Start: {newClipRange[0].toFixed(1)}s</span>
											<span>End: {newClipRange[1].toFixed(1)}s</span>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="bg-gray-800/50 w-full h-[300px] rounded-lg flex items-center justify-center text-gray-500 mb-4">
								No video loaded
							</div>
						)}

						<Button
							onClick={handleAddClip}
							className="w-full bg-purple-500/90 text-white hover:bg-purple-500 hover:scale-105 transition-all duration-200 shadow-md"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Clip
						</Button>

						{clips.length > 0 && (
							<div className="w-full">
								<h4 className="text-md font-semibold text-gray-300 mb-2 flex items-center gap-2">
									<Scissors className="h-4 w-4" />
									Clips:
								</h4>
								<ul className="space-y-2">
									{clips.map((clip, index) => (
										<li
											key={index}
											className={cn(
												"bg-gray-800/50 text-white p-2 rounded-md border border-gray-700 flex justify-between items-center cursor-pointer",
												selectedClipIndex === index &&
													"bg-purple-500/50 border-purple-500", // Highlight selected clip
											)}
											onClick={() => setSelectedClipIndex(index)} // Set selected index on click
										>
											<div className="flex items-center gap-2">
												<PlayCircle className="h-4 w-4" />
												<span>
													Clip {index + 1}: {clip.start.toFixed(1)}s -{" "}
													{clip.end.toFixed(1)}s
												</span>
											</div>
										</li>
									))}
								</ul>
								<div className="mt-4">
									<h3 className="text-lg font-semibold  text-gray-300 mb-2 flex items-center gap-2">
										Trimmed Video Preview
									</h3>
									{trimmedVideoUrl && (
										<div className=" flex flex-col items-left ">
											<div className="rounded-md overflow-hidden shadow-md w-full max-w-[600px] mx-auto ">
												<video
													style={{ maxHeight: "500px", width: "100%" }}
													src={trimmedVideoUrl}
													controls
													className="w-full rounded-md"
												/>
											</div>
											<div className="flex justify-start mt-2">
												<a
													href={trimmedVideoUrl}
													download={`trimmed_video_${Date.now()}.mp4`}
													className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
												>
													Download Trimmed Video
												</a>
											</div>
										</div>
									)}
									{!trimmedVideoUrl && (
										<div className="bg-gray-800/50 w-full h-[300px] rounded-lg flex items-center justify-center text-gray-500  mb-4">
											No trimmed video yet
										</div>
									)}
								</div>
								<Button
									onClick={handleCutClips}
									disabled={loading === "cut" || selectedClipIndex === null} // Disable if loading or no clip selected
									className={cn(
										"mt-4 w-full bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white hover:from-blue-500 to-cyan-500",
										"hover:scale-105 transition-all duration-300 shadow-lg",
										loading === "cut" || selectedClipIndex === null
											? "opacity-70 cursor-not-allowed"
											: "", // Conditional styles
									)}
								>
									{loading === "cut" ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Cutting...
										</>
									) : (
										"Cut Clips"
									)}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-white text-lg flex items-center gap-2">
							<Send className="h-5 w-5" />
							4. Post to Platforms
						</CardTitle>
						<CardDescription className="text-gray-400">
							Select the platforms and accounts to post your videos.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Select
								onValueChange={(value) => setPlatforms([value])} // Simplified for demo
								defaultValue={platforms[0]}
							>
								<SelectTrigger className="w-full bg-black/20 text-white border-purple-500/30">
									<SelectValue placeholder="Select Platform" />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-700">
									<SelectItem
										value="tiktok"
										className="hover:bg-gray-700/50 text-white"
									>
										TikTok
									</SelectItem>
									<SelectItem
										value="youtube_shorts"
										className="hover:bg-gray-700/50 text-white"
									>
										YouTube Shorts
									</SelectItem>
									<SelectItem
										value="instagram_reels"
										className="hover:bg-gray-700/50 text-white"
									>
										Instagram Reels
									</SelectItem>
								</SelectContent>
							</Select>

							<Select
								onValueChange={(value) => setAccounts([value])} // Simplified for demo
								defaultValue={accounts[0]}
							>
								<SelectTrigger className="w-full bg-black/20 text-white border-purple-500/30">
									<SelectValue placeholder="Select Account" />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-700 max-h-[400px] overflow-y-auto">
									{Array.from({ length: 20 }, (_, i) => (
										<SelectItem
											key={i + 1}
											value={`account_${i + 1}`}
											className="hover:bg-gray-700/50 text-white"
										>
											Account {i + 1}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button
							onClick={handlePost}
							disabled={loading === "post"}
							className={cn(
								"w-full bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white hover:from-green-500 to-emerald-500",
								"hover:scale-105 transition-all duration-300 shadow-lg",
								loading === "post" && "opacity-70 cursor-not-allowed",
							)}
						>
							{loading === "post" ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Posting...
								</>
							) : (
								"Post to Platforms"
							)}
						</Button>
					</CardContent>
				</Card>
			</div>
			
		</div>
	);
};

export default VideoRepurposerApp;
