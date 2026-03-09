export interface User {
    id?: string;
    name?: string;
    cpf?: string;
    accessKey?: string;
    note?: string;
    unreadCount?: number;
    lastMessage?: string;
    lastMessageAt?: string;
    muted?: boolean;

    email?: string;
    avatar?: string;
}
export interface UserProfile {
    id?: string;
    name?: string;
    cpf?: string;
    accessKey?: string;
    note?: string;
    about?: string;

    status: string;
    accountId: string;
    accountName: string;

    email?: string;
    avatar?: string;
}
// export interface Profile {
//     id?: string;
//     name?: string;
//     email?: string;
//     avatar?: string;
//     about?: string;
// }
export interface UserContact {
    id?: string;
    avatar?: string;
    name?: string;
    about?: string;
    details?: {
        emails?: {
            email?: string;
            label?: string;
        }[];
        phoneNumbers?: {
            country?: string;
            phoneNumber?: string;
            label?: string;
        }[];
        title?: string;
        company?: string;
        birthday?: string;
        address?: string;
    };
    attachments?: {
        media?: any[];
        docs?: any[];
        links?: any[];
    };
}
export interface UserChat {
    id?: string;
    contactId?: string;
    contact?: UserContact;
    unreadCount?: number;
    muted?: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: {
        id?: string;
        chatId?: string;
        contactId?: string;
        isMine?: boolean;
        value?: string;
        createdAt?: string;
    }[];
}
