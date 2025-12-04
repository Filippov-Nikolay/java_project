export type ModalType =
  | "ASSESSMENT_EDIT"
  | "USER_CREATE"
  | "CONFIRMATION"
  | "CONTACT_VIEW";

export interface ModalItem {
  id: string;
  type: ModalType;
  data?: unknown;
}

export interface ModalState {
  stack: ModalItem[];
}
