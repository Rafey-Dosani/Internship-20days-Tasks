const taskColumns = 'id, title, description, completed, created_at AS "createdAt"';

const updateColumns = {
  title: "title",
  description: "description",
  completed: "completed",
};

export function createTaskService(pool) {
  return {
    async getTasks() {
      const result = await pool.query(
        `SELECT ${taskColumns} FROM public.tasks ORDER BY id`,
      );
      return result.rows;
    },

    async getTaskById(id) {
      const result = await pool.query(
        `SELECT ${taskColumns} FROM public.tasks WHERE id = $1`,
        [id],
      );
      return result.rows[0] ?? null;
    },

    async createTask({ title, description, completed }) {
      const result = await pool.query(
        `INSERT INTO public.tasks (title, description, completed)
         VALUES ($1, $2, $3)
         RETURNING ${taskColumns}`,
        [title, description, completed],
      );
      return result.rows[0];
    },

    async updateTask(id, updates) {
      const fields = Object.keys(updates);
      const assignments = fields.map(
        (field, index) => `${updateColumns[field]} = $${index + 1}`,
      );
      const values = fields.map((field) => updates[field]);
      values.push(id);

      const result = await pool.query(
        `UPDATE public.tasks
         SET ${assignments.join(", ")}
         WHERE id = $${values.length}
         RETURNING ${taskColumns}`,
        values,
      );
      return result.rows[0] ?? null;
    },

    async deleteTask(id) {
      const result = await pool.query(
        `DELETE FROM public.tasks
         WHERE id = $1
         RETURNING ${taskColumns}`,
        [id],
      );
      return result.rows[0] ?? null;
    },
  };
}
