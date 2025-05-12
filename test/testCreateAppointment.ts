import { format } from "date-fns"

// ✅ Mock Supabase client
const supabase = {
  from: (table: string) => ({
    insert: async (data: any) => {
      if (data.title === "fail") {
        return { data: null, error: { message: "Simulated insert failure" } }
      }
      return { data: [{ id: "123", ...data }], error: null }
    },
  }),
}

// ✅ Inline logic copied from your page.tsx
async function createAppointment({
  userId,
  title,
  date,
  time,
  notes,
  reminder,
}: {
  userId: string
  title: string
  date: Date
  time: string
  notes: string
  reminder: boolean
}) {
  if (!userId) throw new Error("Missing user ID")

  const now = new Date()
  const appointmentDateTime = new Date(`${format(date, "yyyy-MM-dd")}T${time}`)

  if (!title.trim()) throw new Error("Title is required")
  if (!notes.trim()) throw new Error("Notes are required")
  if (isNaN(appointmentDateTime.getTime())) throw new Error("Invalid date or time")
  if (appointmentDateTime < now) throw new Error("Cannot schedule an appointment in the past")

  const { data, error } = await supabase.from("appointments").insert({
    user_id: userId,
    title,
    date: format(date, "yyyy-MM-dd"),
    time,
    notes,
    reminder,
  })

  if (error) throw new Error(error.message)
  return data
}

// ✅ Run Manual Tests
;(async () => {
  console.log("== Manual Unit Tests for createAppointment ==\n")

  // Test 1
  try {
    const result = await createAppointment({
      userId: "user_abc",
      title: "1234a",
      date: new Date(Date.now() + 86400000),
      time: "09:00",
      notes: "aaaaaaaa",
      reminder: true,
    })
    console.log("✅ Test 1: Valid input\nResult: PASS\n", result, "\n")
  } catch (err) {
    if (err instanceof Error) {
      console.log("❌ Test 1: Valid input\nResult: FAIL\nError:", err.message, "\n")
    }
  }

  // Test 2
  try {
    await createAppointment({
      userId: "user_abc",
      title: "",
      date: new Date(),
      time: "09:00",
      notes: "Test",
      reminder: true,
    })
    console.log("❌ Test 2: Empty title\nResult: FAIL (no error thrown)\n")
  } catch (err) {
    if (err instanceof Error) {
      console.log("✅ Test 2: Empty title\nResult: PASS\nError:", err.message, "\n")
    }
  }

  // Test 3
  try {
    await createAppointment({
      userId: "user_abc",
      title: "Old Appointment",
      date: new Date("2022-01-01"),
      time: "09:00",
      notes: "Old",
      reminder: true,
    })
    console.log("❌ Test 3: Past date\nResult: FAIL (no error thrown)\n")
  } catch (err) {
    if (err instanceof Error) {
      console.log("✅ Test 3: Past date\nResult: PASS\nError:", err.message, "\n")
    }
  }
})()
