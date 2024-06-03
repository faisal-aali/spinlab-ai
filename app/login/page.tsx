import Image from 'next/image';
import LoginForm from "@/components/LoginForm/LoginForm";
import styles from './login.module.css';
import '../globals.css';


const login = async () => {

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-zinc-900`}>
      <div className="backgroundOverlay"></div>
      <div className={`flex w-full`}>
        <div className={`flex items-center justify-center w-2/5 ${styles.loginBackground}`}>
          <div className={`z-10`}>
            <Image
              src="/assets/spinlab-log.png"
              alt="Logo"
              width={370}
              height={103}
            />
          </div>
        </div>
        <div className={` flex items-center justify-center z-10 w-3/5`}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default login;



// return (
//   <div className="min-h-screen flex items-center justify-center bg-zinc-900">
//     <div className="flex w-full max-w-4xl">
//       <div className="w-1/2 bg-cover bg-center" style="background-image: url('https://placehold.co/800x600');">
//         <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
//           <img src="https://placehold.co/100x100" alt="Logo" className="h-16 w-16">
//           <span className="text-white text-4xl ml-4">spinlab<span className="text-green-500">ai</span></span>
//         </div>
//       </div>
//       <div className="w-1/2 bg-zinc-800 flex items-center justify-center">
//         <div className="bg-zinc-700 p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
//           <form>
//             <div className="mb-4">
//               <label className="block text-zinc-400 mb-2" htmlFor="email">Email</label>
//               <input className="w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-600 rounded focus:outline-none focus:border-green-500" type="email" id="email" placeholder="Email">
//             </div>
//             <div className="mb-6">
//               <label className="block text-zinc-400 mb-2" htmlFor="password">Password</label>
//               <input className="w-full px-3 py-2 bg-zinc-800 text-white border border-zinc-600 rounded focus:outline-none focus:border-green-500" type="password" id="password" placeholder="Password">
//             </div>
//             <div className="flex justify-between items-center mb-6">
//               <a href="#" className="text-green-500 text-sm">Forgot Password?</a>
//             </div>
//             <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none">LOGIN</button>
//           </form>
//           <p className="text-zinc-400 text-center mt-6">Don't have an account? <a href="#" className="text-white font-bold">REGISTER NOW</a></p>
//         </div>
//       </div>
//     </div>
//   </div>
// )
