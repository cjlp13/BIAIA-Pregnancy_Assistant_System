// Simple mock for Supabase client
const mockSupabase = {
  // Track function calls
  calls: {
    from: [] as string[],
    select: [] as string[],
    eq: [] as any[][],
    order: [] as any[][],
  },

  // Set the response for the next call
  mockResponse: {
    data: null as any[] | null,
    error: null as any | null,
  },

  setMockResponse(data: any[] | null, error: any | null) {
    this.mockResponse = { data, error };
  },

  from(table: string) {
    this.calls.from.push(table);

    const chain = {
      select: (columns: string) => {
        this.calls.select.push(columns);
        return {
          eq: (field: string, value: any) => {
            this.calls.eq.push([field, value]);
            return {
              order: (field: string, options: any) => {
                this.calls.order.push([field, options]);
                return Promise.resolve({ ...this.mockResponse });
              },
            };
          },
        };
      },
    };

    return chain;
  },
};

// Recreate the fetchEntries function from page.tsx
async function fetchEntries(user: { id: string } | null): Promise<any[]> {
  if (!user) return [];

  try {
    // Clear previous call records
    mockSupabase.calls = {
      from: [],
      select: [],
      eq: [],
      order: [],
    };

    const { data, error } = await mockSupabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error("Error fetching journal entries:", error.message);
    return [];
  }
}

// Run tests
(async () => {
  console.log("== Manual Unit Tests for fetchEntries ==\n");

  // Test 1: Happy path - user exists and entries are returned
  const testEntries = [
    {
      id: "1",
      user_id: "test-user-id",
      title: "Test Entry 1",
      description: "Test description",
      mood_type: "positive",
      mood_score: 8,
      date: "2025-05-01",
    },
  ];

  mockSupabase.setMockResponse(testEntries, null);

  const test1 = await fetchEntries({ id: "test-user-id" });
  const test1Result =
    test1.length === 1 && test1[0].title === "Test Entry 1" ? "PASS" : "FAIL";
  console.log(
    `✅ Test 1: Happy path - user exists\nResult: ${test1Result} \nEntries: ${JSON.stringify(
      test1,
      null,
      2
    )}\n`
  );

  // Test 2: No user provided
  const test2 = await fetchEntries(null);
  const test2Result = Array.isArray(test2) && test2.length === 0 ? "PASS" : "FAIL";
  console.log(
    `⚠️ Test 2: No user provided\nResult: ${test2Result} \nEntries: ${JSON.stringify(
      test2,
      null,
      2
    )}\n`
  );

  // Test 3: Database error
  mockSupabase.setMockResponse(null, { message: "Database connection error" });

  // Track if console.error was called
  const originalConsoleError = console.error;
  let errorWasLogged = false;

  console.error = (...args: any[]) => {
    errorWasLogged = true;
    originalConsoleError(...args); // Also log to console
  };

  const test3 = await fetchEntries({ id: "test-user-id" });
  const test3Result =
    Array.isArray(test3) && test3.length === 0 && errorWasLogged ? "PASS" : "FAIL";
  console.log(
    `❌ Test 3: Database error\nResult: ${test3Result} \nEntries: ${JSON.stringify(
      test3,
      null,
      2
    )}\n`
  );

  // Restore original console.error
  console.error = originalConsoleError;

  // Verify correct parameters were passed to Supabase
  console.log("Supabase call verification:");
  console.log(
    `- from() called with "journal_entries": ${
      mockSupabase.calls.from.includes("journal_entries") ? "✅" : "❌"
    }`
  );
  console.log(
    `- select() called with "*": ${
      mockSupabase.calls.select.includes("*") ? "✅" : "❌"
    }`
  );
  console.log(
    `- eq() called with "user_id": ${
      mockSupabase.calls.eq.some((call) => call[0] === "user_id") ? "✅" : "❌"
    }`
  );
  console.log(
    `- order() called with "date": ${
      mockSupabase.calls.order.some((call) => call[0] === "date") ? "✅" : "❌"
    }`
  );
})();
