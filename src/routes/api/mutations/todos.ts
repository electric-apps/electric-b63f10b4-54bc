import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values(body);
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			PATCH: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							title: body.title,
							completed: body.completed,
							updated_at: new Date(),
						})
						.where(eq(todos.id, body.id as string));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ request }: { request: Request }) => {
				const body = await request.json();
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, body.id as string));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
