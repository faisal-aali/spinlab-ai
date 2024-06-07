import React from "react";
import ForgetPassword from "../../components/ForgetPassword/ForgetPassword";
import styles from "./LoginForm.module.css";

const forgetpassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 backgroundOverlay">
     <ForgetPassword/>
    </div>
  );
};

export default forgetpassword;