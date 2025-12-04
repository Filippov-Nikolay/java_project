import type { ReactNode } from "react";
import StoreProvider from "@shared/store/StoreProvider";
import ModalRoot from "@features/modals/ui/ModalRoot";
import NotificationRoot from "@features/notifications/ui/NotificationRoot";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
            <body>
                <StoreProvider>
                    {children}
                    <NotificationRoot />
                    <ModalRoot />
                </StoreProvider>
            </body>
        </html>
    );
}
