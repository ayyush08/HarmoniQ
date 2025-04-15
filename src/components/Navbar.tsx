'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ColourfulText } from './ui/colourful-text.tsx';
import { APP_NAME } from '@/lib/constants';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    // Check if the user is logged in by checking the token (in cookies, session, etc.)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsCheckingAuth(true);
                const res = await fetch('/api/me'); // your auth-check API
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }

            } catch (err) {
                console.error(err);
                setIsLoggedIn(false);
            }finally{
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [isLoggedIn]);


    const handleLogin = () => {
        router.push('/login'); // Redirect to login page
    };

    const handleSignup = () => {
        router.push('/signup'); // Redirect to signup page
    };

    const handleProfile = () => {
        router.push('/profile'); // Redirect to profile page
    };

    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                setIsLoggedIn(false);
                router.push('/'); // Redirect to home page after logout
            } else {
                console.error('Logout failed');
            }
        } catch (err) {
            console.error(err);
        }
    }

    if(isCheckingAuth) {
        return (
            <nav className="bg-transparent fixed top-0 left-0 w-full p-4 shadow-lg z-30">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-5xl font-bold text-white">
                        <ColourfulText text={APP_NAME} />
                    </Link>
                    <p className="text-white">Loading...</p>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-transparent fixed top-0 left-0 w-full p-4 shadow-lg z-30">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-5xl font-bold text-white">
                    <ColourfulText text={APP_NAME} />
                </Link>
                <div className="space-x-4 flex items-center">
                    <p>12318074 - Ayush Kumar Gupta</p>
                    <p>12317053 - Anshika</p>
                    {!isLoggedIn ? (
                        <>
                            {pathname !== "/login" && (
                                <button
                                    className="text-white cursor-pointer bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            )}
                            {pathname !== "/signup" && (
                                <button
                                    className="text-white cursor-pointer bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
                                    onClick={handleSignup}
                                >
                                    Signup
                                </button>
                            )}

                        </>
                    ) : (
                        <>
                            {pathname !== "/profile" && (
                                <button
                                    className="text-white cursor-pointer bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded"
                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                            )}

                            <button
                                className="text-white cursor-pointer bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;