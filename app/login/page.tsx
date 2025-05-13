"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify"; // Import toast
import config from "@/config";
import Link from "next/link";
import { useRouter } from 'next/navigation';
// Animation variants
const loginVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeInOut" },
	},
};

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const router = useRouter(); //  Use Next.js router for navigation

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// API call for login
		try {
			const response = await fetch(`${config.api.baseURL}/auth/login`, {
				// Corrected URL
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Invalid credentials");
			}
			const data = await response.json();
			// Store the token
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", username); // Save username

			// If login is successful
			toast.success("Login successful!");
            router.push("/");
			setUsername("");
			setPassword("");
		} catch (err: any) {
			setError(err.message || "An error occurred during login.");
			toast.error(err.message || "An error occurred during login.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-8 flex items-center justify-center">
			<motion.div
				variants={loginVariants}
				initial="hidden"
				animate="visible"
				className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md p-6 sm:p-8 space-y-8"
			>
				<h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
					Login
				</h1>
				{error && (
					<div className="bg-red-500/20 text-red-400 p-3 rounded-lg border border-red-500/30">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="username" className="text-gray-300">
							Username
						</Label>
						<Input
							id="username"
							type="text"
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password" className="text-gray-300">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
						/>
					</div>
					<Button
						type="submit"
						className={cn(
							"w-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white hover:from-purple-500 to-blue-500",
							"hover:scale-105 transition-all duration-300 shadow-lg",
							loading && "opacity-70 cursor-not-allowed",
						)}
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Logging in...
							</>
						) : (
							"Login"
						)}
					</Button>
				</form>
				<div className="text-center text-gray-400 text-sm">
					Don't have an account?{" "}
					<Link
						href="/signup"
						className="text-blue-400 hover:underline ml-2"
					>
						Sign up
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
