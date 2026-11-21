export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>CranioCare</h1>
      <p>
        Pediatric cranial orthosis management — patient registry, head-shape
        assessments, 3D scan records, helmet production tracking, and
        follow-up appointments.
      </p>
      <ul>
        <li>Patients — intake and treatment timeline</li>
        <li>Assessments — circumference, cephalic index (CI), CVAI progress</li>
        <li>Scans — 3D scan sessions linked to each visit</li>
        <li>Helmets — production status pipeline</li>
        <li>Appointments — fitting and follow-up scheduling</li>
      </ul>
      <p style={{ color: "#666" }}>
        Scaffold page — modules are being built per TASKS.md.
      </p>
    </main>
  );
}
