import { useEffect, useState } from "react";
import { get, post } from "../api";
const blank = { regNumber: "", name: "", type: "", maxLoad: "", odometer: "", acquisitionCost: "" };
export default function Vehicles() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const load = () => get("/vehicles").then(setList);
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      await post("/vehicles", { ...f, maxLoad: +f.maxLoad, odometer: +f.odometer, acquisitionCost: +f.acquisitionCost 
});
      setF(blank);
      setErr("");
      load();
    } catch (ex) {
      setErr(ex.message);
    }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <h3>Vehicles</h3>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <form className="row g-2 mb-4" onSubmit={save}>
        <div className="col"><input className="form-control" placeholder="Reg No" value={f.regNumber} onChange=
{set("regNumber")} required /></div>
        <div className="col"><input className="form-control" placeholder="Name" value={f.name} onChange={set("name")} 
required /></div>
        <div className="col"><input className="form-control" placeholder="Type" value={f.type} onChange={set("type")} 
required /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Max Load kg" value={f.maxLoad} 
onChange={set("maxLoad")} required /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Odometer" value={f.odometer} 
onChange={set("odometer")} /></div>
        <div className="col-auto"><button className="btn btn-primary">Add</button></div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>Reg</th><th>Name</th><th>Type</th><th>Load</th><th>Status</th></tr></thead>
        <tbody>
          {list.map((v) => (
            <tr key={v.id}>
              <td>{v.regNumber}</td><td>{v.name}</td><td>{v.type}</td>
              <td>{v.maxLoad} kg</td>
              <td><span className="badge bg-secondary">{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}