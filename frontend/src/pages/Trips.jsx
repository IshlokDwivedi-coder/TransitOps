import { useEffect, useState } from "react";
import { get, post } from "../api";
export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [opt, setOpt] = useState({ vehicles: [], drivers: [] });
  const [f, setF] = useState({ source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", 
plannedDistance: "" });
  const [err, setErr] = useState("");
  const load = () => {
    get("/trips").then(setTrips);
    get("/trips/options").then(setOpt);
  };
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const create = async (e) => {
    e.preventDefault();
    try {
      await post("/trips", {
        ...f,
        vehicleId: +f.vehicleId,
        driverId: +f.driverId,
        cargoWeight: +f.cargoWeight,
        plannedDistance: +f.plannedDistance,
      });
      setErr("");
      load();
    } catch (ex) {
      setErr(ex.message);
    }
  };
  const act = async (id, action, body) => {
    try {
      await post(`/trips/${id}/${action}`, body);
      setErr("");
      load();
    } catch (ex) {
      setErr(ex.message);
    }
  };
  return (
    <>
      <h3>Trips</h3>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <form className="row g-2 mb-4" onSubmit={create}>
        <div className="col"><input className="form-control" placeholder="From" value={f.source} onChange=
{set("source")} required /></div>
        <div className="col"><input className="form-control" placeholder="To" value={f.destination} onChange=
{set("destination")} required /></div>
        <div className="col">
          <select className="form-select" value={f.vehicleId} onChange={set("vehicleId")} required>
            <option value="">Vehicle</option>
            {opt.vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} ({v.maxLoad}kg)</option>)}
          </select>
        </div>
        <div className="col">
          <select className="form-select" value={f.driverId} onChange={set("driverId")} required>
            <option value="">Driver</option>
            {opt.drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="col"><input className="form-control" type="number" placeholder="Cargo kg" value=
{f.cargoWeight} onChange={set("cargoWeight")} required /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Distance km" value=
{f.plannedDistance} onChange={set("plannedDistance")} required /></div>
        <div className="col-auto"><button className="btn btn-primary">Create</button></div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>Route</th><th>Vehicle</th><th>Driver</th><th>Cargo</th><th>Status</th><th>Actions</th></tr>
</thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t.id}>
              <td>{t.source} → {t.destination}</td>
              <td>{t.vehicle?.regNumber}</td>
              <td>{t.driver?.name}</td>
              <td>{t.cargoWeight} kg</td>
              <td><span className="badge bg-secondary">{t.status}</span></td>
              <td>
                {t.status === "DRAFT" && (
                  <button className="btn btn-sm btn-success me-1" onClick={() => act(t.id, 
"dispatch")}>Dispatch</button>
                )}
                {t.status === "DISPATCHED" && (
                  <button className="btn btn-sm btn-primary me-1"
                    onClick={() => act(t.id, "complete", { finalOdometer: +prompt("Final odometer?"), fuelUsed: 
+prompt("Fuel used (L)?") })}>
                    Complete
                  </button>
                )}
                {(t.status === "DRAFT" || t.status === "DISPATCHED") && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => act(t.id, 
"cancel")}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}