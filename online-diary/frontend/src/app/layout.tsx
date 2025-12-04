import type { ReactNode } from "react";
import StoreProvider from "@shared/store/StoreProvider";
import ModalRoot from "@features/modals/ui/ModalRoot";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
            <body>
                <StoreProvider>
                    {children}
                    <ModalRoot />
                </StoreProvider>
            </body>
        </html>
    );
}
