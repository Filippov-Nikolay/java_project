"use client";

import { useParams, useRouter } from "next/navigation";
import { SubmissionsTable } from "@widgets/submissions-table";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";

export default function SubmissionsPage() {
    const { id } = useParams();
    const router = useRouter();

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button variant="secondary" onClick={() => router.back()}>← Назад</Button>
                    <h1>Перевірка робіт</h1>
                </div>
            </header>

            <SubmissionsTable assessmentId={id as string} />
        </main>
    );
}