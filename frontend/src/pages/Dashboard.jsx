import { useEffect, useState } from "react";
import { get } from "../api";
const Card = ({ label, value, color }) => (
<div className="col-md-3 mb-3">
<div className={`card text-bg-${color} p-3`}>
<h6>{label}</h6>
<h2>{value}</h2>
</div>
</div>
);
export default function Dashboard() {
const [d, setD] = useState(null);
useEffect(() => { get("/dashboard").then(setD); }, []);
if (!d) return <p>Loading...</p>;
}
return (
<>
<h3 className="mb-3">Fleet Overview</h3>
<div className="row">
<Card label="Available" value={d.available} color="success" />
<Card label="On Trip" value={d.onTrip} color="primary" />
<Card label="In Maintenance" value={d.inShop} color="warning" />
<Card label="Utilization" value={d.utilization + "%"} color="dark" />
<Card label="Active Trips" value={d.activeTrips} color="info" />
<Card label="Pending Trips" value={d.pendingTrips} color="secondary" />
</div>
</>
);
