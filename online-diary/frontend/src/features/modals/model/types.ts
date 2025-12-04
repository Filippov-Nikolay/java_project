export type ModalType =
    | "ASSESSMENT_EDIT"
    | "USER_CREATE"
    | "CONFIRMATION"
    | "CONTACT_VIEW";

export interface ModalItem {
    id: string;
    type: ModalType;
    data?: any;
}

export interface ModalState {
    stack: ModalItem[];
}

export type ModalComponentProps = {
    data?: any;
    isTop: boolean;
    onClose: () => void;
};
