import dayjs from "dayjs";

export function validatePassword(password: string): boolean {
    return password.length >= 8;
}

export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatDateOfBirth(date: Date): string {
    return dayjs(date).format("YYYY-MM-DD");
} 

export function validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 16;
}