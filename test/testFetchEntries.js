var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Simple mock for Supabase client
var mockSupabase = {
    // Track function calls
    calls: {
        from: [],
        select: [],
        eq: [],
        order: [],
    },
    // Set the response for the next call
    mockResponse: {
        data: null,
        error: null,
    },
    setMockResponse: function (data, error) {
        this.mockResponse = { data: data, error: error };
    },
    from: function (table) {
        var _this = this;
        this.calls.from.push(table);
        var chain = {
            select: function (columns) {
                _this.calls.select.push(columns);
                return {
                    eq: function (field, value) {
                        _this.calls.eq.push([field, value]);
                        return {
                            order: function (field, options) {
                                _this.calls.order.push([field, options]);
                                return Promise.resolve(__assign({}, _this.mockResponse));
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
function fetchEntries(user) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/, []];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    // Clear previous call records
                    mockSupabase.calls = {
                        from: [],
                        select: [],
                        eq: [],
                        order: [],
                    };
                    return [4 /*yield*/, mockSupabase
                            .from("journal_entries")
                            .select("*")
                            .eq("user_id", user.id)
                            .order("date", { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_1 = _b.sent();
                    console.error("Error fetching journal entries:", error_1.message);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Run tests
(function () { return __awaiter(_this, void 0, void 0, function () {
    var testEntries, test1, test1Result, test2, test2Result, originalConsoleError, errorWasLogged, test3, test3Result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("== Manual Unit Tests for fetchEntries ==\n");
                testEntries = [
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
                return [4 /*yield*/, fetchEntries({ id: "test-user-id" })];
            case 1:
                test1 = _a.sent();
                test1Result = test1.length === 1 && test1[0].title === "Test Entry 1" ? "PASS" : "FAIL";
                console.log("\u2705 Test 1: Happy path - user exists\nResult: ".concat(test1Result, " \nEntries: ").concat(JSON.stringify(test1, null, 2), "\n"));
                return [4 /*yield*/, fetchEntries(null)];
            case 2:
                test2 = _a.sent();
                test2Result = Array.isArray(test2) && test2.length === 0 ? "PASS" : "FAIL";
                console.log("\u26A0\uFE0F Test 2: No user provided\nResult: ".concat(test2Result, " \nEntries: ").concat(JSON.stringify(test2, null, 2), "\n"));
                // Test 3: Database error
                mockSupabase.setMockResponse(null, { message: "Database connection error" });
                originalConsoleError = console.error;
                errorWasLogged = false;
                console.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    errorWasLogged = true;
                    originalConsoleError.apply(void 0, args); // Also log to console
                };
                return [4 /*yield*/, fetchEntries({ id: "test-user-id" })];
            case 3:
                test3 = _a.sent();
                test3Result = Array.isArray(test3) && test3.length === 0 && errorWasLogged ? "PASS" : "FAIL";
                console.log("\u274C Test 3: Database error\nResult: ".concat(test3Result, " \nEntries: ").concat(JSON.stringify(test3, null, 2), "\n"));
                // Restore original console.error
                console.error = originalConsoleError;
                // Verify correct parameters were passed to Supabase
                console.log("Supabase call verification:");
                console.log("- from() called with \"journal_entries\": ".concat(mockSupabase.calls.from.includes("journal_entries") ? "✅" : "❌"));
                console.log("- select() called with \"*\": ".concat(mockSupabase.calls.select.includes("*") ? "✅" : "❌"));
                console.log("- eq() called with \"user_id\": ".concat(mockSupabase.calls.eq.some(function (call) { return call[0] === "user_id"; }) ? "✅" : "❌"));
                console.log("- order() called with \"date\": ".concat(mockSupabase.calls.order.some(function (call) { return call[0] === "date"; }) ? "✅" : "❌"));
                return [2 /*return*/];
        }
    });
}); })();
