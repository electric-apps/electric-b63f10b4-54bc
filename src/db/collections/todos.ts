import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "@/db/zod-schemas";

function getBaseUrl() {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	return `http://localhost:${process.env.VITE_PORT || 5174}`;
}

export const todosCollection = createCollection<Todo>(
	electricCollectionOptions({
		id: "todos",
		shapeOptions: {
			url: `${getBaseUrl()}/api/todos`,
		},
		schema: todoSelectSchema,
		primaryKey: ["id"],
		onInsert: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mutation.modified),
			});
			const result = await response.json();
			return { txid: result.txid };
		},
		onUpdate: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mutation.modified),
			});
			const result = await response.json();
			return { txid: result.txid };
		},
		onDelete: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: mutation.original.id }),
			});
			const result = await response.json();
			return { txid: result.txid };
		},
	}),
);
