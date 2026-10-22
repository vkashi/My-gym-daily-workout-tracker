 "use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import "./styles.css";

type MuscleStatus = "trained" | "missed" | "pending";
type MuscleName =
  | "chest" | "shoulders" | "biceps" | "triceps" | "forearms"
  | "abs" | "back" | "traps" | "glutes" | "quads" | "hamstrings" | "calves";

const muscleLabels: Record<MuscleName, string> = {
  chest: "Chest", shoulders: "Shoulders", biceps: "Biceps", triceps: "Triceps",
  forearms: "Forearms", abs: "Abs", back: "Back / Lats", traps: "Traps",
  glutes: "Glutes", quads: "Quadriceps", hamstrings: "Hamstrings", calves: "Calves"
};

const workoutDays = [
  { day: "Monday", name: "Push", targets: ["chest", "shoulders", "triceps"] as MuscleName[] },
  { day: "Tuesday", name: "Pull", targets: ["back", "traps", "biceps", "forearms"] as MuscleName[] },
  { day: "Wednesday", name: "Legs", targets: ["quads", "hamstrings", "glutes", "calves", "abs"] as MuscleName[] },
  { day: "Thursday", name: "Upper", targets: ["chest", "back", "shoulders", "traps"] as MuscleName[] },
  { day: "Friday", name: "Lower", targets: ["quads", "hamstrings", "glutes", "calves", "abs"] as MuscleName[] },
  { day: "Saturday", name: "Arms + Cardio", targets: ["biceps", "triceps", "forearms", "abs", "quads", "calves"] as MuscleName[] }
];

function Muscle({ name, status, position, scale, rotation = [0, 0, 0] }: {
  name: MuscleName; status: MuscleStatus; position: [number, number, number];
  scale: [number, number, number]; rotation?: [number, number, number];
}) {
  const color = status === "trained" ? "#28a765" : status === "missed" ? "#ed4545" : "#b8c2ce";
  return <mesh position={position} scale={scale} rotation={rotation}>
    <capsuleGeometry args={[0.5, 0.5, 6, 12]} />
    <meshStandardMaterial color={color} roughness={0.42} metalness={0.08} />
  </mesh>;
}

function HumanModel({ view, statuses }: { view: "front" | "back"; statuses: Record<MuscleName, MuscleStatus> }) {
  const back = view === "back";
  const muscle = (name: MuscleName, pos: [number, number, number], size: [number, number, number], rot: [number, number, number] = [0, 0, 0]) =>
    <Muscle key={`${name}-${pos.join("-")}`} name={name} status={statuses[name]} position={pos} scale={size} rotation={rot} />;

  return <group position={[0, -0.25, 0]} scale={1.05}>
    {/* Sculpted neutral body base */}
    <mesh position={[0, 2.55, 0]} castShadow>
      <sphereGeometry args={[0.36, 32, 32]} />
      <meshStandardMaterial color="#d9e0e8" roughness={0.35} metalness={0.08} />
    </mesh>
    <mesh position={[0, 2.1, 0]} scale={[0.25, 0.3, 0.22]} castShadow>
      <cylinderGeometry args={[0.68, 0.8, 0.5, 32]} />
      <meshStandardMaterial color="#cbd4df" roughness={0.42} />
    </mesh>
    <mesh position={[0, 1.25, 0]} scale={[0.62, 1.0, 0.35]} castShadow>
      <capsuleGeometry args={[0.45, 0.65, 8, 24]} />
      <meshStandardMaterial color="#cbd4df" roughness={0.45} />
    </mesh>
    {/* Arms and legs */}
    {[-1, 1].map((s) => <group key={s}>
      <mesh position={[s * 0.72, 1.6, 0]} rotation={[0, 0, s * -0.13]} castShadow>
        <capsuleGeometry args={[0.14, 0.68, 8, 16]} />
        <meshStandardMaterial color="#cbd4df" roughness={0.45} />
      </mesh>
      <mesh position={[s * 0.88, 0.98, 0]} rotation={[0, 0, s * -0.16]} castShadow>
        <capsuleGeometry args={[0.105, 0.56, 8, 16]} />
        <meshStandardMaterial color="#cbd4df" roughness={0.45} />
      </mesh>
      <mesh position={[s * 0.39, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.19, 0.78, 8, 18]} />
        <meshStandardMaterial color="#cbd4df" roughness={0.45} />
      </mesh>
      <mesh position={[s * 0.39, -0.67, 0]} castShadow>
        <capsuleGeometry args={[0.135, 0.62, 8, 18]} />
        <meshStandardMaterial color="#cbd4df" roughness={0.45} />
      </mesh>
      <mesh position={[s * 0.42, -1.12, 0.08]} scale={[0.19, 0.1, 0.35]} castShadow>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#b9c4d0" roughness={0.5} />
      </mesh>
    </group>)}
    {/* Muscle groups; paired placements make a readable front/back anatomy map */}
    {!back && <>
      {muscle("shoulders", [-0.48, 1.95, 0.05], [0.25, 0.25, 0.24])}
      {muscle("shoulders", [0.48, 1.95, 0.05], [0.25, 0.25, 0.24])}
      {muscle("chest", [-0.25, 1.75, 0.3], [0.28, 0.22, 0.16])}
      {muscle("chest", [0.25, 1.75, 0.3], [0.28, 0.22, 0.16])}
      {muscle("biceps", [-0.69, 1.53, 0.12], [0.14, 0.25, 0.15], [0, 0, -0.15])}
      {muscle("biceps", [0.69, 1.53, 0.12], [0.14, 0.25, 0.15], [0, 0, 0.15])}
      {muscle("forearms", [-0.86, 1.08, 0.1], [0.12, 0.27, 0.12], [0, 0, -0.15])}
      {muscle("forearms", [0.86, 1.08, 0.1], [0.12, 0.27, 0.12], [0, 0, 0.15])}
      {muscle("abs", [-0.13, 1.27, 0.31], [0.12, 0.35, 0.08])}
      {muscle("abs", [0.13, 1.27, 0.31], [0.12, 0.35, 0.08])}
      {muscle("quads", [-0.39, 0.05, 0.17], [0.17, 0.39, 0.13])}
      {muscle("quads", [0.39, 0.05, 0.17], [0.17, 0.39, 0.13])}
      {muscle("calves", [-0.39, -0.68, 0.1], [0.13, 0.29, 0.12])}
      {muscle("calves", [0.39, -0.68, 0.1], [0.13, 0.29, 0.12])}
    </>}
    {back && <>
      {muscle("traps", [0, 1.92, -0.24], [0.32, 0.24, 0.13])}
      {muscle("shoulders", [-0.48, 1.95, -0.04], [0.25, 0.25, 0.22])}
      {muscle("shoulders", [0.48, 1.95, -0.04], [0.25, 0.25, 0.22])}
      {muscle("triceps", [-0.69, 1.53, -0.1], [0.14, 0.25, 0.14], [0, 0, -0.15])}
      {muscle("triceps", [0.69, 1.53, -0.1], [0.14, 0.25, 0.14], [0, 0, 0.15])}
      {muscle("forearms", [-0.86, 1.08, -0.1], [0.12, 0.27, 0.12], [0, 0, -0.15])}
      {muscle("forearms", [0.86, 1.08, -0.1], [0.12, 0.27, 0.12], [0, 0, 0.15])}
      {muscle("back", [-0.23, 1.5, -0.3], [0.23, 0.43, 0.1])}
      {muscle("back", [0.23, 1.5, -0.3], [0.23, 0.43, 0.1])}
      {muscle("glutes", [-0.2, 0.57, -0.2], [0.2, 0.22, 0.12])}
      {muscle("glutes", [0.2, 0.57, -0.2], [0.2, 0.22, 0.12])}
      {muscle("hamstrings", [-0.39, 0.02, -0.15], [0.16, 0.38, 0.12])}
      {muscle("hamstrings", [0.39, 0.02, -0.15], [0.16, 0.38, 0.12])}
      {muscle("calves", [-0.39, -0.68, -0.08], [0.13, 0.29, 0.12])}
      {muscle("calves", [0.39, -0.68, -0.08], [0.13, 0.29, 0.12])}
    </>}
  </group>;
}

function BodyCard({ view, statuses }: { view: "front" | "back"; statuses: Record<MuscleName, MuscleStatus> }) {
  return <div className="body-card">
    <h3>{view === "front" ? "FRONT VIEW" : "BACK VIEW"}</h3>
    <Canvas camera={{ position: [0, 0.85, 6.8], fov: 36 }} shadows dpr={[1, 1.5]}>
      <color attach="background" args={["#f7f8fa"]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 7, 5]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-4, 2, -4]} intensity={0.7} />
      <Suspense fallback={null}>
        <HumanModel view={view} statuses={statuses} />
        <Environment preset="studio" />
        <ContactShadows position={[0, -1.28, 0]} opacity={0.18} scale={4} blur={2.5} far={4} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={4.8} maxDistance={9} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
    <p className="drag-hint">Drag to rotate · Scroll to zoom</p>
  </div>;
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const day = workoutDays[selectedDay];

  const statuses = useMemo(() => {
    const result = {} as Record<MuscleName, MuscleStatus>;
    (Object.keys(muscleLabels) as MuscleName[]).forEach((muscle) => {
      if (!day.targets.includes(muscle)) result[muscle] = "pending";
      else result[muscle] = completed[`${selectedDay}-${muscle}`] ? "trained" : "missed";
    });
    return result;
  }, [day, selectedDay, completed]);

  function toggleMuscle(muscle: MuscleName) {
    setCompleted(prev => ({ ...prev, [`${selectedDay}-${muscle}`]: !prev[`${selectedDay}-${muscle}`] }));
  }

  return <main className="app-shell">
    <header className="topbar">
      <div><span className="brand-mark">VK</span><span className="brand-name">IRON SIX</span></div>
      <span className="top-caption">TRAIN · TRACK · IMPROVE</span>
    </header>
    <section className="intro">
      <div><p className="eyebrow">3D MUSCLE TRACKER</p><h1>Know what you<br/><em>worked today.</em></h1>
        <p className="subcopy">Explore a 3D body model and track the muscle groups trained for each workout day.</p></div>
      <div className="summary-chip"><span className="summary-dot"/> LIVE BODY MAP <strong>{day.name}</strong></div>
    </section>
    <nav className="day-selector" aria-label="Workout day selector">
      {workoutDays.map((item, index) => <button key={item.day} className={index === selectedDay ? "day-pill active" : "day-pill"} onClick={() => setSelectedDay(index)}>
        <small>{item.day.slice(0,3).toUpperCase()}</small><strong>{item.name}</strong>
      </button>)}
    </nav>
    <section className="body-grid">
      <BodyCard view="front" statuses={statuses}/>
      <BodyCard view="back" statuses={statuses}/>
    </section>
    <section className="tracker-panel">
      <div className="tracker-head"><div><p className="eyebrow">DAILY MUSCLE CHECKLIST</p><h2>{day.day} · {day.name}</h2></div>
        <span>{day.targets.filter(m => completed[`${selectedDay}-${m}`]).length} / {day.targets.length} groups completed</span></div>
      <div className="muscle-checklist">
        {day.targets.map(muscle => <label key={muscle} className="muscle-check">
          <input type="checkbox" checked={!!completed[`${selectedDay}-${muscle}`]} onChange={() => toggleMuscle(muscle)}/>
          <span className="custom-check"/>
          <span className="muscle-label">{muscleLabels[muscle]}</span>
          <span className={`status-label ${completed[`${selectedDay}-${muscle}`] ? "is-done" : "is-missed"}`}>{completed[`${selectedDay}-${muscle}`] ? "TRAINED" : "NOT DONE"}</span>
        </label>)}
      </div>
      <p className="fineprint">Green = marked trained · Red = targeted but not completed · Grey = not targeted on this workout. Your entries are local to this page session in this starter version.</p>
    </section>
    <footer>IRON SIX · Interactive 3D muscle tracker</footer>
  </main>;
}
