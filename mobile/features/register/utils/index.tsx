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