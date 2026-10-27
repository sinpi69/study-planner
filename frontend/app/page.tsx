"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, Subject, Task } from "@/lib/api";

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

const fmtDate = (s: string) =>
  new Date(`${s}T00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const fmtMinutes = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [dueDate, setDueDate] = useState(addDays(1));
  const [minutes, setMinutes] = useState("45");

  const [subjectName, setSubjectName] = useState("");
  const [subjectColor, setSubjectColor] = useState("#2b59e0");

  async function load() {
    try {
      const [s, t] = await Promise.all([api.subjects(), api.tasks()]);
      setSubjects(s);
      setTasks(t);
      setError("");
    } catch {
      setError("Can't reach the API on port 8080. Start the Spring Boot app, then refresh.");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function run(fn: () => Promise<unknown>) {
    try {
      await fn();
      await load();
    } catch {
      setError("That change didn't save. Check the API is running and try again.");
    }
  }

  const formSubject: number | "" = subjectId !== "" ? subjectId : subjects[0]?.id ?? "";

  function addTask(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || formSubject === "") return;
    run(async () => {
      await api.addTask({
        subjectId: formSubject,
        title: title.trim(),
        dueDate,
        estimatedMinutes: minutes ? Number(minutes) : null,
      });
      setTitle("");
    });
  }

  function addSubject(e: FormEvent) {
    e.preventDefault();
    if (!subjectName.trim()) return;
    run(async () => {
      await api.addSubject({ name: subjectName.trim(), color: subjectColor });
      setSubjectName("");
    });
  }

  function removeSubject(s: Subject) {
    if (!confirm(`Delete ${s.name} and all its tasks?`)) return;
    if (filter === s.id) setFilter(null);
    run(() => api.deleteSubject(s.id));
  }

  const byId = new Map(subjects.map((s) => [s.id, s]));
  const today = iso(new Date());
  const weekEnd = addDays(7);

  const visible = tasks
    .filter((t) => filter === null || t.subjectId === filter)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const open = visible.filter((t) => !t.done);
  const groups = [
    { label: "Overdue", late: true, items: open.filter((t) => t.dueDate < today) },
    { label: "Next 7 days", late: false, items: open.filter((t) => t.dueDate >= today && t.dueDate <= weekEnd) },
    { label: "Later", late: false, items: open.filter((t) => t.dueDate > weekEnd) },
    { label: "Done", late: false, items: visible.filter((t) => t.done) },
  ];
  const weekMinutes = open
    .filter((t) => t.dueDate <= weekEnd)
    .reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0);
  const openCount = (id: number) => tasks.filter((t) => t.subjectId === id && !t.done).length;

  return (
    <div className="shell">
      <aside className="side">
        <h1>Study planner</h1>
        <nav aria-label="Subjects">
          <div className="subject-row">
            <button className={filter === null ? "subject on" : "subject"} onClick={() => setFilter(null)}>
              All subjects tasks <span>{tasks.filter((t) => !t.done).length}</span>
            </button>
          </div>
          {subjects.map((s) => (
            <div className="subject-row" key={s.id}>
              <button className={filter === s.id ? "subject on" : "subject"} onClick={() => setFilter(s.id)}>
                <i style={{ background: s.color }} />
                {s.name}
                <span>{openCount(s.id)}</span>
              </button>
              <button className="icon" aria-label={`Delete ${s.name}`} onClick={() => removeSubject(s)}>
                ×
              </button>
            </div>
          ))}
        </nav>
        <form className="add-subject" onSubmit={addSubject}>
          <input
            type="color"
            aria-label="Subject colour"
            value={subjectColor}
            onChange={(e) => setSubjectColor(e.target.value)}
          />
          <input
            type="text"
            aria-label="Subject name"
            placeholder="New subject"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <button className="secondary" type="submit">
            Add subject
          </button>
        </form>
      </aside>

      <main>
        <p className="summary">
          {open.length} open {open.length === 1 ? "task" : "tasks"}.{" "}
          {weekMinutes > 0 ? `${fmtMinutes(weekMinutes)} of work due in the next 7 days.` : "Nothing due in the next 7 days."}
        </p>

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        <form className="add-task" onSubmit={addTask}>
          <input
            type="text"
            className="wide"
            aria-label="Task"
            placeholder="What do you need to study?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            aria-label="Subject"
            value={formSubject}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            {subjects.length === 0 && <option value="">Add a subject first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input type="date" aria-label="Due date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input
            type="number"
            min={5}
            step={5}
            aria-label="Minutes"
            placeholder="Minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
          <button className="primary" type="submit">
            Add task
          </button>
        </form>

        {loaded && !error && tasks.length === 0 && (
          <p className="empty">No tasks yet. Add your first one above.</p>
        )}

        {groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.label} className={g.late ? "group late" : "group"}>
              <h2>{g.label}</h2>
              <ul>
                {g.items.map((t) => {
                  const sub = byId.get(t.subjectId);
                  return (
                    <li key={t.id} className={t.done ? "task done" : "task"} style={{ borderLeftColor: sub?.color }}>
                      <input
                        type="checkbox"
                        checked={t.done}
                        aria-label={`Mark "${t.title}" as done`}
                        onChange={() => run(() => api.updateTask({ ...t, done: !t.done }))}
                      />
                      <div>
                        <span className="name">{t.title}</span>
                        <span className="meta">{sub?.name}</span>
                      </div>
                      <span className="when">{fmtDate(t.dueDate)}</span>
                      <span className="len">{t.estimatedMinutes ? fmtMinutes(t.estimatedMinutes) : ""}</span>
                      <button
                        className="icon"
                        aria-label={`Delete "${t.title}"`}
                        onClick={() => run(() => api.deleteTask(t.id))}
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
      </main>
    </div>
  );
}
