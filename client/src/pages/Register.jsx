import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    await register(form);
    navigate("/login");
  };

  return (
    <div className="p-10">
      <h1>Register</h1>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
