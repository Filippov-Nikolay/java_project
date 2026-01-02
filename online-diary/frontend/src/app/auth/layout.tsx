"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token"); //

        if (!token) {
            router.push("/auth/login");
        }
    }, [router]);

    return (
        <div className={styles.authLayout}>

            {children}
        </div>
    );
}