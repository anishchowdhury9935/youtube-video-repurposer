"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, HelpCircle, ChevronDown } from 'lucide-react'; // Import icons
import { cn } from "@/lib/utils";

interface UserProfile {
    username: string;
    // Add other user properties as needed (e.g., displayName, avatarUrl)
}

const FloatingProfileButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [username, setUsername] = useState<string | null>(null);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

     useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername || "Guest");
        }
    }, []);

    const handleLogout = () => {
        //  Implement your logout logic here (e.g., clear session, redirect)
        console.log("Logging out...");
        // In a real application, you would:
        // 1. Clear the user's session (e.g., remove JWT token from localStorage)
        localStorage.removeItem('token'); // Example: Remove token
        localStorage.removeItem('username');
        // 2. Redirect the user to the login page or home page
          window.location.href = '/login';
        // 3. Update any global state that tracks the user's authentication status
        //   setUser(null); // Example:  If you have a user state in context
        setIsOpen(false); // Close the dropdown after logging out
    };

    if (!username) {
        return null; // Or you could render a "Login" button here
    }

    return (
        <div ref={containerRef} className="fixed top-4 right-4 z-50">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "relative rounded-full h-10 w-10 p-0 transition-all duration-300",
                            "hover:scale-110 hover:bg-white/10",
                            "border border-white/20 shadow-lg backdrop-blur-md",
                            "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                        )}
                    >
                        <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${username}.png`} alt={username} />
                            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="absolute bottom-[-4px] right-[-4px] h-5 w-5 text-purple-400/90" />
                    </Button>
                </DropdownMenuTrigger>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute right-0 mt-2 w-56 bg-black/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md"
                            style={{ pointerEvents: 'none' }}
                        >
                            <DropdownMenuContent
                                align="end"
                                className="p-0"
                                alignOffset={40}
                            >
                                <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10 truncate"  style={{ pointerEvents: 'all',color:"gray" }}>
                                    Signed in as <span className="font-semibold text-white truncate" style={{color:"gray"}}>{username}</span>
                                </div>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="hover:bg-white/5 hover:text-white transition-colors duration-200 rounded-b-md flex items-center gap-2"
                                    style={{ pointerEvents: 'all' }}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DropdownMenu>
        </div>
    );
};

export default FloatingProfileButton;
