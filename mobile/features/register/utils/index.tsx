import dayjs from "dayjs";
import RegistrationFour from "../components/Registration/RegistrationFour";
import RegistrationOne from "../components/Registration/RegistrationOne";
import RegistrationThree from "../components/Registration/RegistrationThree";
import RegistrationTwo from "../components/Registration/RegistrationTwo";

export function determineRegistrationStep(step: number) {
    switch(step) {
        case 0:
            return <RegistrationOne />
        case 1:
            return <RegistrationTwo />
        case 2:
            return <RegistrationThree />
        case 3:
            return <RegistrationFour />
    }
}

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