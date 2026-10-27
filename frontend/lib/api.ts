const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type Subject = { id: number; name: string; color: string };
export type Task = {
  id: number;
  subjectId: number;
  title: string;
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes: number | null;
  done: boolean;
};

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  subjects: () => req<Subject[]>("/subjects"),
  addSubject: (s: Omit<Subject, "id">) =>
    req<Subject>("/subjects", { method: "POST", body: JSON.stringify(s) }),
  deleteSubject: (id: number) => req<void>(`/subjects/${id}`, { method: "DELETE" }),

  tasks: () => req<Task[]>("/tasks"),
  addTask: (t: Omit<Task, "id" | "done">) =>
    req<Task>("/tasks", { method: "POST", body: JSON.stringify(t) }),
  updateTask: (t: Task) =>
    req<Task>(`/tasks/${t.id}`, { method: "PUT", body: JSON.stringify(t) }),
  deleteTask: (id: number) => req<void>(`/tasks/${id}`, { method: "DELETE" }),
};
