import RegisterForm from "../../components/RegisterForm/RegisterForm";
import '../globals.css';

const register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center backgroundOverlay">
            <RegisterForm />
        </div>
    );
}

export default register;