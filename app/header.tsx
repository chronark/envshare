
import React from "react"
import Link from "next/link"

export const Header: React.FC = () => {

    return (
        <header
            className="fixed top-0 z-30 w-full backdrop-blur bh-zinc-900/50"
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Site branding */}
                    <div className="mr-4 shrink-0">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-semibold duration-150 text-zinc-100 hover:text-white">

                            EnvShare
                        </Link>
                    </div>
                    {/* Desktop navigation */}
                    <nav className="items-center hidden grow md:flex">
                        <ul className="flex flex-wrap items-center justify-end gap-4 grow">
                            <li className="hidden md:block">
                                <Link
                                    className="flex items-center px-3 py-2 transition duration-150 ease-in-out text-zinc-200 hover:text-zinc-50 lg:px-5"
                                    href="/deploy"
                                >
                                    Deploy
                                </Link>
                            </li>
                            <li className="hidden md:block">
                                <Link
                                    className="flex items-center px-3 py-2 transition duration-150 ease-in-out text-zinc-200 hover:text-zinc-50 lg:px-5"
                                    href="/unseal"
                                >
                                    Unseal
                                </Link>
                            </li>
                            <li className="hidden md:block">
                                <Link
                                    className="flex items-center px-3 py-2 transition duration-150 ease-in-out text-zinc-200 hover:text-zinc-50 lg:px-5"
                                    href="/share"
                                >
                                    Share
                                </Link>
                            </li>
                            <li className="hidden md:block">
                                <Link
                                    className="flex items-center px-3 py-2 transition duration-150 ease-in-out text-zinc-200 hover:text-zinc-50 lg:px-5"
                                    href="https://github.com/chronark/envshare"
                                >
                                    GitHub
                                </Link>
                            </li>


                        </ul>
                    </nav>
                </div>
            </div>
            {/* Fancy fading bottom border */}

        </header>
    )
}