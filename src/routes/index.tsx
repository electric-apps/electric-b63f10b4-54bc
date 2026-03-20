import {
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Separator,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare2, Inbox, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");
	const [filter, setFilter] = useState<Filter>("all");

	const { data: todos, isLoading } = useLiveQuery(
		(q) =>
			q
				.from({ todos: todosCollection })
				.orderBy(({ todos }) => todos.created_at, "asc"),
		[],
	);

	const filteredTodos = (todos ?? []).filter((todo: Todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true;
	});

	const activeCount = (todos ?? []).filter((t: Todo) => !t.completed).length;
	const completedCount = (todos ?? []).filter((t: Todo) => t.completed).length;

	async function addTodo(e: React.FormEvent) {
		e.preventDefault();
		const title = newTitle.trim();
		if (!title) return;
		setNewTitle("");
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}

	function toggleTodo(todo: Todo) {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updated_at = new Date();
		});
	}

	function deleteTodo(id: string) {
		todosCollection.delete(id);
	}

	function clearCompleted() {
		const completed = (todos ?? []).filter((t: Todo) => t.completed);
		for (const t of completed) {
			todosCollection.delete(t.id);
		}
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex align="center" gap="3">
					<CheckSquare2 size={32} color="var(--violet-9)" />
					<Heading size="7">My Todos</Heading>
				</Flex>

				{/* Add Todo Form */}
				<form onSubmit={addTodo}>
					<Flex gap="2">
						<Box flexGrow="1">
							<TextField.Root
								size="3"
								placeholder="What needs to be done?"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
							/>
						</Box>
						<Button size="3" type="submit" disabled={!newTitle.trim()}>
							Add
						</Button>
					</Flex>
				</form>

				{/* Filter Tabs */}
				<Flex gap="2" align="center">
					{(["all", "active", "completed"] as Filter[]).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "soft"}
							color={filter === f ? "violet" : "gray"}
							size="2"
							onClick={() => setFilter(f)}
							style={{ textTransform: "capitalize" }}
						>
							{f}
							{f === "active" && activeCount > 0 && (
								<Text size="1" ml="1">
									({activeCount})
								</Text>
							)}
							{f === "completed" && completedCount > 0 && (
								<Text size="1" ml="1">
									({completedCount})
								</Text>
							)}
						</Button>
					))}
					{completedCount > 0 && (
						<>
							<Box flexGrow="1" />
							<Button
								variant="ghost"
								color="gray"
								size="2"
								onClick={clearCompleted}
							>
								Clear completed
							</Button>
						</>
					)}
				</Flex>

				{/* Todo List */}
				{isLoading ? (
					<Flex align="center" justify="center" py="9">
						<Spinner size="3" />
					</Flex>
				) : filteredTodos.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<Inbox size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "all"
								? "No todos yet — add one above!"
								: filter === "active"
									? "No active todos"
									: "No completed todos"}
						</Text>
					</Flex>
				) : (
					<Card variant="surface">
						<Flex direction="column">
							{filteredTodos.map((todo: Todo, i: number) => (
								<Box key={todo.id}>
									{i > 0 && <Separator size="4" />}
									<Flex align="center" gap="3" px="3" py="3">
										<Checkbox
											size="2"
											checked={todo.completed}
											onCheckedChange={() => toggleTodo(todo)}
											color="violet"
										/>
										<Text
											size="3"
											flexGrow="1"
											style={{
												textDecoration: todo.completed
													? "line-through"
													: "none",
												color: todo.completed ? "var(--gray-9)" : "inherit",
											}}
										>
											{todo.title}
										</Text>
										<IconButton
											size="1"
											variant="ghost"
											color="red"
											onClick={() => deleteTodo(todo.id)}
											aria-label="Delete todo"
										>
											<Trash2 size={14} />
										</IconButton>
									</Flex>
								</Box>
							))}
						</Flex>
					</Card>
				)}

				{/* Footer stats */}
				{(todos ?? []).length > 0 && (
					<Text size="2" color="gray" align="center">
						{activeCount} item{activeCount !== 1 ? "s" : ""} left
					</Text>
				)}
			</Flex>
		</Container>
	);
}
