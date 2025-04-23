'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ColourfulText } from './ui/colourful-text.tsx';
import { APP_NAME } from '@/lib/constants';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    // Check if the user is logged in by checking the token (in cookies, session, etc.)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsCheckingAuth(true);
                const res = await fetch('/api/me',{
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                }); // your auth-check API
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }

            } catch (err) {
                console.error(err);
                setIsLoggedIn(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [pathname]);


    const handleLogin = () => {
        router.push('/login'); // Redirect to login page
    };

    const handleSignup = () => {
        router.push('/signup'); // Redirect to signup page
    };

    const handleProfile = () => {
        router.push('/profile'); // Redirect to profile page
    };



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

    if (isCheckingAuth) {
        return (
            <nav className="bg-transparent fixed top-0 left-0 w-full p-4 shadow-lg z-30">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-5xl font-bold text-white">
                        <ColourfulText text={APP_NAME} />
                    </Link>
                    <p className="text-white font-semibold">Loading...</p>
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
                <div className="space-x-4 flex items-center font-semibold font-sans">
                    <p>12318074 - Ayush Kumar Gupta</p>
                    <p>12317053 - Anshika</p>
                    {!isLoggedIn ? (
                        <>
                            {pathname !== "/login" && (
                                <button
                                    className="text-white cursor-pointer border-4 font-bold transition-all  border-blue-500 hover:bg-blue-700/30 px-4 py-2 rounded-lg"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            )}
                            {pathname !== "/signup" && (
                                <button
                                    className="text-white cursor-pointer border-4 font-bold transtion-all border-green-500 hover:bg-green-700/30 px-4 py-2 rounded-lg"
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
                                    className="text-white font-bold transition-all cursor-pointer border-4 rounded-lg border-purple-600 hover:bg-purple-700/30 px-4 py-2 "
                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                            )}

                            <button
                                className="text-white cursor-pointer border-4 font-bold
                                   border-red-500 hover:bg-red-700/30 px-4 py-2 rounded-lg transition-all"
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