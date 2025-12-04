export type NotificationStatus = "successful" | "warning" | "error" | "default";

export interface NotificationItem {
    id: string;
    message: string;
    status: NotificationStatus;
}

export interface NotificationState {
    queue: NotificationItem[];
}
