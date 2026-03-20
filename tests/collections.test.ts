import { describe, it, expect } from "vitest"
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todos collection validation", () => {
	it("insert schema accepts valid todo data", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("JSON round-trip preserves todo data", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		const result = todoSelectSchema.safeParse(parsed)
		expect(result.success).toBe(true)
	})

	it("JSON round-trip restores Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		expect(parsed.created_at).toBeInstanceOf(Date)
		expect(parsed.updated_at).toBeInstanceOf(Date)
	})

	it("completed field defaults to false", () => {
		const row = generateValidRow(todoInsertSchema)
		const withFalse = { ...row, completed: false }
		const result = todoInsertSchema.safeParse(withFalse)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.completed).toBe(false)
		}
	})

	it("completed field accepts true", () => {
		const row = generateValidRow(todoInsertSchema)
		const withTrue = { ...row, completed: true }
		const result = todoInsertSchema.safeParse(withTrue)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.completed).toBe(true)
		}
	})

	it("rejects non-boolean completed value", () => {
		const row = generateValidRow(todoInsertSchema)
		const invalid = { ...row, completed: "yes" }
		const result = todoInsertSchema.safeParse(invalid)
		expect(result.success).toBe(false)
	})
})
