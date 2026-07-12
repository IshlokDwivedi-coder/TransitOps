import { useEffect, useState } from "react";
import { get, post } from "../api";
const blank = { name: "", licenseNumber: "", licenseCategory: "", licenseExpiry: "", contact: "", safetyScore: "" };
export default function Drivers() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const load = () => get("/drivers").then(setList);
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      await post("/drivers", { ...f, safetyScore: +f.safetyScore });
      setF(blank);
      setErr("");
      load();
    } catch (ex) {
      setErr(ex.message);
    }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const expired = (d) => d.licenseExpiry && new Date(d.licenseExpiry) < new Date();
  return (
    <>
      <h3>Drivers</h3>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <form className="row g-2 mb-4" onSubmit={save}>
        <div className="col"><input className="form-control" placeholder="Name" value={f.name} onChange={set("name")} 
required /></div>
        <div className="col"><input className="form-control" placeholder="License No" value={f.licenseNumber} 
onChange={set("licenseNumber")} required /></div>
        <div className="col"><input className="form-control" placeholder="Category" value={f.licenseCategory} 
onChange={set("licenseCategory")} required /></div>
        <div className="col"><input className="form-control" type="date" value={f.licenseExpiry} onChange=
{set("licenseExpiry")} required /></div>
        <div className="col"><input className="form-control" placeholder="Contact" value={f.contact} onChange=
{set("contact")} /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Safety" value={f.safetyScore} 
onChange={set("safetyScore")} /></div>
        <div className="col-auto"><button className="btn btn-primary">Add</button></div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>Name</th><th>License</th><th>Category</th><th>Expiry</th><th>Safety</th><th>Status</th></tr>
</thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td><td>{d.licenseNumber}</td><td>{d.licenseCategory}</td>
              <td>{d.licenseExpiry} {expired(d) && <span className="badge bg-danger">EXPIRED</span>}</td>
              <td>{d.safetyScore}</td>
              <td><span className="badge bg-secondary">{d.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
