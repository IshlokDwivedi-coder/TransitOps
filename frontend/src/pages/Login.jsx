import { useState } from "react";
import { post } from "../api";
export default function Login({ onLogin }) {
const [email, setEmail] = useState("manager@transitops.com");
const [pw, setPw] = useState("admin123");
const [err, setErr] = useState("");
const submit = async (e) => {
e.preventDefault();
try {
const u = await post("/login", { email, password: pw });
localStorage.setItem("user", JSON.stringify(u));
onLogin(u);
} catch {
setErr("Invalid credentials");
}
};
return (
<div className="container" style={{ maxWidth: 380, marginTop: 100 }}>
<div className="card p-4 shadow-sm">
<h4 className="mb-3">TransitOps Login</h4>
{err && <div className="alert alert-danger py-1">{err}</div>}
<form onSubmit={submit}>
<input className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} 
placeholder="Email" />
<input className="form-control mb-3" type="password" value={pw} onChange={(e) => setPw(e.target.value)} 
placeholder="Password" />
<button className="btn btn-primary w-100">Login</button>
</form>
<small className="text-muted mt-2">Seeded: manager@transitops.com / admin123</small>
</div>
</div>
);
}
