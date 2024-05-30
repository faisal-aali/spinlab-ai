'use client';
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useState } from "react";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [user, setUser] = useState({ email: "", password: "" });
    const handleSubmit = async (e) => {
      e.preventDefault();
      signIn("credentials", {
        email: user.email,
        password: user.password
      });
    };

    return (
      // <div classNameName={styles.form_warper}>
      //   <h1 classNameName="text-1xl font-bold underline">Hello, Next.js!</h1>
      //   <h2>LOGIN ACCOUNT</h2>
      //   <form onSubmit={handleSubmit}>
      //     <div classNameName={styles.form_warper}>
      //       <input classNameName={styles.input_form} type="email" name="email" value={user.email} onChange={e => setUser(p => ({ ...p, email: e.target.value }))} required placeholder="Jhon_deo@gmail.com"/>
      //       <label classNameName={styles.label_form} htmlFor="email">Email</label>
      //     </div>
      //     <div classNameName={styles.password}>
      //       <input classNameName={styles.input_form} type="password" name="password" value={user.password} onChange={e => setUser(p => ({ ...p, password: e.target.value }))} required placeholder="Xbshsd$##@31!"/>
      //       <label classNameName={styles.label_form} htmlFor="password">Password</label>
      //     </div>
      //     <div classNameName={styles.login_error}>
      //         {/*authUserResults.isError? authUserResults.error.data.massage: ''*/}
      //     </div>
      //     <button classNameName={styles.button_effect}>Login</button>
      //     <p classNameName={styles.button_desc}>Don`t Have An Account ?</p>
      //     <Link href="/register" classNameName={`${styles.open_button} ${styles.button_effect}`}>Open Account</Link>
      //   </form>
      // </div>
      
    <div className={`min-h-screen flex items-center justify-center ${styles.formWidth}`}>
          <div className="w-full flex items-center justify-center">
      <div className="bg-transparent border primary-border py-12 px-6 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
        <form className="mt-11">
          <div className="mb-4">
             <input className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45" type="email" name="email" value={user.email} onChange={e => setUser(p => ({ ...p, email: e.target.value }))} required placeholder="Email"/>
          </div>
          <div className="mb-6">
            <input className="w-full px-3 bg-transparent rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45	" type="password" name="password" value={user.password} onChange={e => setUser(p => ({ ...p, password: e.target.value }))} required placeholder="Password"/>
          </div>
          <div className="flex justify-between items-center mb-6">
            <a href="#" className="text-green-500 text-sm text-primary">Forgot Password?</a>
          </div>
          <button className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none">LOGIN</button>
        </form>
        <p className="text-zinc-400 text-center mt-6">Don't have an account? <a href="/register" className="text-white font-bold">REGISTER NOW</a></p>
      </div>
    </div>
  </div>

    );
}

export default LoginForm;