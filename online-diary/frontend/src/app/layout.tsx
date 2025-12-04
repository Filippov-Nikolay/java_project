import type { ReactNode } from "react";
import StoreProvider from "@shared/store/StoreProvider";
import ModalRoot from "@features/modals/ui/ModalRoot";
import NotificationRoot from "@features/notifications/ui/NotificationRoot";
import ThemeWatcher from "@features/theme/ui/ThemeWatcher";
import "@shared/styles/globals.scss";

const themeInitScript = `
(function() {
  try {
    var storageKey = "theme-mode";
    var stored = localStorage.getItem(storageKey);
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var mode = stored === "dark" || stored === "light" ? stored : (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.setProperty("--theme-toggle-label", mode === "dark" ? '"Темная тема"' : '"Светлая тема"');
    document.documentElement.style.setProperty("--theme-toggle-icon", mode === "dark" ? '"🌙"' : '"☀️"');
  } catch (e) {
    // ignore
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body>
                <StoreProvider>
                    <ThemeWatcher />
                    {children}
                    <NotificationRoot />
                    <ModalRoot />
                </StoreProvider>
            </body>
        </html>
    );
}
