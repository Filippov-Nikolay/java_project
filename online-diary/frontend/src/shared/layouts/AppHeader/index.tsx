"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import clsx from "clsx";
import { 
    IoPersonOutline, 
    IoLogOutOutline, 
    IoChevronDownOutline 
} from "react-icons/io5";

import { useAuth } from "@features/auth/model/useAuth";
import { userApi } from "@entities/user/api/userApi";
import { User } from "@entities/user/model/types";

import ThemeToggle from "@features/theme/ui/ThemeToggle";
import LogoMark from "@shared/ui/Logo";
import { NotificationsDropdown } from "@features/notifications/ui/NotificationsDropdown";

import styles from "./styles.module.scss";

interface AppHeaderProps {
    logoText?: string;
}

export const AppHeader = ({ logoText = "JByte" }: AppHeaderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    useEffect(() => {
        userApi.getMe() 
            .then(setUser)
            .catch((err) => console.error("Header Profile Error:", err));
    }, []);


    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const initials = user 
        ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
        : "??";

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/">
                    <LogoMark />
                </Link>
                <span className={styles.logoText}>{logoText}</span>
            </div>

            <div className={styles.right}>
                <div className={styles.themeToggleWrapper}>
                    <ThemeToggle />
                </div>

                <NotificationsDropdown />

                <div className={styles.userMenuWrapper} ref={dropdownRef}>
                    <button
                        type="button"
                        className={clsx(styles.avatarButton, isDropdownOpen && styles.active)}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-label="Профіль"
                    >
                        <div className={styles.avatarCircle}>
                            {user?.avatarUrl ? (
                                <img 
                                    src={user.avatarUrl} 
                                    alt="Avatar" 
                                    className={styles.avatarImg} 
                                />
                            ) : (
                                <span className={styles.initials}>{initials}</span>
                            )}
                        </div>
                        <IoChevronDownOutline 
                            className={clsx(styles.chevron, isDropdownOpen && styles.rotate)} 
                        />
                    </button>

                    {isDropdownOpen && user && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownInfo}>
                                <p className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className={styles.userEmail}>{user.email}</p>
                                {user.groupName && (
                                    <span className={styles.userGroup}>
                                        {user.groupName}
                                    </span>
                                )}
                            </div>
                            
                            <div className={styles.dropdownDivider} />
                            
                            <Link 
                                href="/profile" 
                                className={styles.dropdownItem}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <IoPersonOutline />
                                <span>Профіль</span>
                            </Link>
                            
                            <button 
                                className={clsx(styles.dropdownItem, styles.logout)} 
                                onClick={logout}
                            >
                                <IoLogOutOutline />
                                <span>Вийти</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};