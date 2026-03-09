export interface ApiResponse<T> {
    code: string;
    message: string;
    values: any;
    id: string | null;
    status: boolean;
    data: T;
}
