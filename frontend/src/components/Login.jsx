import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const ProceedLogin = (e) => {
    e.preventDefault();
    if (validate) {
      axios
        .post("http://127.0.0.1:8000/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res.data.token.refresh);
          console.log(res.data.is_admin);
          localStorage.setItem("token", res.data.token.access);
          if (res.data.is_admin !== true) {
            navigate("/home");
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Enter valid email and password");
        });
    }
  };
  const validate = () => {
    let result = true;
    if (email === "" || email === null) {
      result = false;
      alert("please enter your phone number");
    }
    if (password === "" || password === null) {
      result = false;
      alert("please enter your password");
    }
    return result;
  };
  return (
    <div>
      <div className=" bg-white h-full w-screen p-0 m-0">
        <div className=" w-full md:mt-32 md:ml-[600px] md:w-80 shadow-md border rounded-md border-slate-300 ">
          <form onSubmit={ProceedLogin}>
            <div className=" bg-blue-500 h-16 pt-3  text-center text-2xl font-semibold rounded-t-md  ">
              User Login
            </div>
            <div className=" mt-7">
              <label htmlFor="" className=" pl-3 ">
                Email: <br />
                <input
                  className="mt-2 block w-11/12 ml-3 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <br />
            <div className=" -my-3">
              <label htmlFor="" className=" p-3">
                Password: <br />
                <input
                  className=" mt-2 block w-11/12 ml-3 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <br />
            <p className=" mt-2 ml-56 md:ml-40 text-pink-300 text-sm hover:text-pink-500 cursor-pointer">
              <NavLink to="/signup">don&apos;t have account yet?</NavLink>
            </p>
            <button
              className=" w-20 h-10 text-white bg-blue-500 mt-5 mb-5 ml-44 md:ml-32 rounded-lg hover:bg-blue-700"
              type="submit"
            >
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
