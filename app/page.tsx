"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
	LayoutDashboard,
	Video,
	ArrowRight,
	UserCircle,
	Baby,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Corrected import
import useAuth from "@/components/authorize";

// Animation variants for the cards
const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeInOut" },
	},
	hover: { scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" },
	tap: { scale: 0.98 },
};

// Dummy data for the mini-apps.
interface MiniApp {
	title: string;
	description: string;
	route: string;
	icon: React.ReactNode;
}

const miniApps: MiniApp[] = [
	{
		title: "Video Repurposer",
		description: "Repurpose videos.",
		route: "/video-repurposer",
		icon: <Video className="h-6 w-6 text-blue-400" />,
	},
	{
		title: "Video to baby podcast",
		description: "Convert videos to podcasts.",
		route: "/editor",
		icon: <Baby className="h-6 w-6 text-red-400" />,
	},
];

const Dashboard = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
	const [userName, setUserName] = useState(""); // State for profile dropdown
	const profileRef = useRef<HTMLDivElement>(null);
	const { isAuth } = useAuth();
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setUserName(storedUsername || "Guest");
		}
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
			{/* Navbar */}
			<nav className="bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10 sticky top-0 z-50">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<LayoutDashboard className="h-6 w-6 text-blue-400" />
						<span className="text-xl font-bold text-white">Video Suite</span>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-6 items-center">
						{/* Desktop Menu Items can be added here if required */}
						<div ref={profileRef} className="relative inline-block">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleProfile}
								className="text-gray-300 hover:text-white rounded-full
                                           border-2 border-transparent hover:border-purple-500/50
                                           transition-all duration-300"
							>
								<UserCircle className="h-8 w-8" />
							</Button>
							<AnimatePresence>
								{isProfileOpen && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95, y: -10 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg origin-top-right"
									>
										<div className="py-1">
											<div className="px-4 py-2 text-sm text-gray-300">
												Signed in as
											</div>
											<div
												className={cn(
													"px-4 py-2 text-md font-semibold text-white truncate max-w-[200px]",
													"overflow-hidden whitespace-nowrap",
												)}
											>
												{userName || "Guest"}
											</div>
											<div className="border-t border-gray-700" />
											<Button
												variant="ghost"
												className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											>
												Sign out
											</Button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<div ref={profileRef} className="relative inline-block">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleProfile}
								className="text-gray-300 hover:text-white rounded-full
                                       border-2 border-transparent hover:border-purple-500/50
                                       transition-all duration-300"
							>
								<UserCircle className="h-8 w-8" />
							</Button>
							<AnimatePresence>
								{isProfileOpen && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95, y: -10 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg origin-top-right z-50"
									>
										<div className="py-1">
											<div className="px-4 py-2 text-sm text-gray-300">
												Signed in as
											</div>
											<div
												className={cn(
													"px-4 py-2 text-md font-semibold text-white truncate max-w-[200px]",
													"overflow-hidden whitespace-nowrap",
												)}
											>
												{userName || "Guest"}
											</div>
											<div className="border-t border-gray-700" />
											<Button
												variant="ghost"
												className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
											>
												Sign out
											</Button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="p-4 md:p-8">
				<div className="max-w-6xl mx-auto space-y-8">
					<div className="text-center">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
							Video Creation Suite
						</h1>
						<p className="text-gray-400 text-lg">
							Welcome to your video creation hub. Choose a tool below to get
							started.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{miniApps.map((app) => (
							<motion.div
								key={app.route}
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								whileHover="hover"
								whileTap="tap"
								className="flex flex-col"
							>
								<Card
									className="bg-white/5 border border-white/10 shadow-xl backdrop-blur-md
                                               transition-all duration-300
                                               hover:border-purple-500/20
                                               hover:shadow-purple-500/20 flex-1"
								>
									<CardHeader>
										<CardTitle className="text-white text-lg flex items-center gap-3">
											{app.icon}
											{app.title}
										</CardTitle>
										<CardDescription className="text-gray-400">
											{app.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex flex-col justify-end">
										<Link href={app.route} passHref>
											<Button
												className={cn(
													"w-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white hover:from-purple-500 to-blue-500",
													"hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-end mt-4 cursor-pointer", // Add mt-4 to push button to bottom
												)}
											>
												Go to {app.title}
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</Link>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
