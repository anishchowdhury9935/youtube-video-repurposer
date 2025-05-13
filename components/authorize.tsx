"use client";
import config from "@/config";
import helperFunctions from "@/helper/helper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useAuth = () => {
	const [isAuth, setIsAuth] = useState<boolean | null>(null); // null: initial, true/false: result
	const [loading, setLoading] = useState(true);
	const { doWhenNotLoggedIn } = helperFunctions(); // Import helper functions
	useEffect(() => {
		const checkAuthToken = async () => {
			const token = localStorage.getItem("token"); // Get token.

			if (!token) {
				doWhenNotLoggedIn();
				setIsAuth(false);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(`${config.api.baseURL}/auth/check-token`, {
					// Use your backend route
					method: "GET",
					headers: {
						Authorization: `${token}`, //  Include the token in the header
					},
				});

				if (response.ok) {
					setIsAuth(true);
					setLoading(false);
					toast.success("Authenticated");
				} else {
					setIsAuth(false);
					setLoading(false);
					const errorData = await response.json();
					toast.error(errorData.message || "Authentication failed");
					doWhenNotLoggedIn();
				}
			} catch (error: any) {
				setIsAuth(false);
				setLoading(false);
				toast.error(error.message || "Error checking authentication", {
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 3000,
				});
			}
		};

		checkAuthToken();
	}, []);

	return { isAuth, loading };
};

export default useAuth;
