"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Result } from 'antd';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="max-w-3xl mx-auto text-center"
            >
                <Result
                    status="404"
                    title={<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">404</span>} // Apply gradient to 404
                    subTitle={<span className="text-gray-300">Sorry, the page you visited does not exist.</span>} // Use a slightly lighter gray
                    className="text-white"
                    extra={
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="mt-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 border-blue-500/30 transition-all duration-300 flex items-center gap-2 mx-auto" // Centered the button
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Button>
                        </Link>
                    }
                />
            </motion.div>
        </div>
    );
};

// Wrap with next/link only if it's used within a Next.js application
const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => {
    if (typeof window !== 'undefined') {
        try {
            const NextLink = require('next/link').default; // Use require instead of import
            return <NextLink href={href} {...props}>{children}</NextLink>;
        } catch (e) {
            console.warn("next/link is not available.  Using standard <a> tag.");
            return <a href={href} {...props}>{children}</a>;
        }
    }
    return <a href={href} {...props}>{children}</a>;
};

export default NotFoundPage;

