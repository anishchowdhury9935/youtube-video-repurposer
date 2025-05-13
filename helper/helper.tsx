import type { Response } from "express";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
export default function helperFunctions() {
	const router = useRouter(); // Initialize the router
	const index = {
		tryCatch: async (fn: (...args: any[]) => any, res?: Response) => {
			try {
				return await fn();
			} catch (error) {
				if (res) {
					res.status(500).json({
						error: "An error occurred while processing your request.",
					});
				}
				toast.warn("Something went wrong!", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: false,
					draggable: true,
					progress: undefined,
				});
				console.error("Error:", error);
			}
		},
		doWhenNotLoggedIn: () => {
			toast.warn("Please log in to continue.", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				draggable: true,
				progress: undefined,
			});
			router.push("/login"); // Use router to redirect to login page
		}
	};
	return {
		...index,
	};
}
