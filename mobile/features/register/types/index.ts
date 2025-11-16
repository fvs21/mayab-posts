export type RegisterBody = {
    full_name: string;
    email: string;
    username: string;
    password: string;
}

export type RegisterResponse = {
    //user: User;
    access_token: string;
    refresh_token: string;
}