-- Task fields are aliased to match the Day 8 API's camelCase response.

-- Select all tasks.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks;

-- Select one task by ID.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
WHERE id = 1;

-- Insert a task; the identity column generates the ID.
INSERT INTO public.tasks (title, description)
VALUES ('Prepare the weekly progress update', 'Summarize completed work.')
RETURNING id, title, description, completed, created_at AS "createdAt";

-- Update a task.
UPDATE public.tasks
SET completed = TRUE
WHERE id = 5
RETURNING id, title, description, completed, created_at AS "createdAt";

-- Delete a task.
DELETE FROM public.tasks
WHERE id = 8
RETURNING id, title, description, completed, created_at AS "createdAt";

-- Filter pending tasks.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
WHERE completed = FALSE;

-- Sort newest tasks first.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
ORDER BY created_at DESC;

-- Limit the result set.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
ORDER BY created_at DESC
LIMIT 5;

-- Count tasks grouped by completion state.
SELECT completed, COUNT(*) AS task_count
FROM public.tasks
GROUP BY completed
ORDER BY completed;

-- Match a phrase case-sensitively with LIKE.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
WHERE title LIKE '%API%';

-- Match a phrase case-insensitively with ILIKE.
SELECT id, title, description, completed, created_at AS "createdAt"
FROM public.tasks
WHERE title ILIKE '%postgresql%';

-- Commit a group of related changes atomically.
BEGIN;
UPDATE public.tasks
SET completed = TRUE
WHERE id = 5;
INSERT INTO public.tasks (title, description)
VALUES ('Review the Day 9 schema', 'Check constraints and API field mappings.');
COMMIT;

-- Roll back changes when a transaction should not be kept.
BEGIN;
UPDATE public.tasks
SET completed = FALSE
WHERE id = 1;
ROLLBACK;

-- Create an index for filtering by completion and sorting by creation time.
CREATE INDEX IF NOT EXISTS tasks_completed_created_at_idx
    ON public.tasks (completed, created_at DESC);

-- Inspect indexes defined on the tasks table.
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'tasks'
ORDER BY indexname;
