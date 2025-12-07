"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
// ✅ Mock Supabase client
var supabase = {
    from: function (table) { return ({
        insert: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (data.title === "fail") {
                    return [2 /*return*/, { data: null, error: { message: "Simulated insert failure" } }];
                }
                return [2 /*return*/, { data: [__assign({ id: "123" }, data)], error: null }];
            });
        }); },
    }); },
};
// ✅ Inline logic copied from your page.tsx
function createAppointment(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var now, appointmentDateTime, _c, data, error;
        var userId = _b.userId, title = _b.title, date = _b.date, time = _b.time, notes = _b.notes, reminder = _b.reminder;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!userId)
                        throw new Error("Missing user ID");
                    now = new Date();
                    appointmentDateTime = new Date("".concat((0, date_fns_1.format)(date, "yyyy-MM-dd"), "T").concat(time));
                    if (!title.trim())
                        throw new Error("Title is required");
                    if (!notes.trim())
                        throw new Error("Notes are required");
                    if (isNaN(appointmentDateTime.getTime()))
                        throw new Error("Invalid date or time");
                    if (appointmentDateTime < now)
                        throw new Error("Cannot schedule an appointment in the past");
                    return [4 /*yield*/, supabase.from("appointments").insert({
                            user_id: userId,
                            title: title,
                            date: (0, date_fns_1.format)(date, "yyyy-MM-dd"),
                            time: time,
                            notes: notes,
                            reminder: reminder,
                        })];
                case 1:
                    _c = _d.sent(), data = _c.data, error = _c.error;
                    if (error)
                        throw new Error(error.message);
                    return [2 /*return*/, data];
            }
        });
    });
}
// ✅ Run Manual Tests
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1, err_2, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("== Manual Unit Tests for createAppointment ==\n");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, createAppointment({
                        userId: "user_abc",
                        title: "1234a",
                        date: new Date(Date.now() + 86400000),
                        time: "09:00",
                        notes: "aaaaaaaa",
                        reminder: true,
                    })];
            case 2:
                result = _a.sent();
                console.log("✅ Test 1: Valid input\nResult: PASS\n", result, "\n");
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                if (err_1 instanceof Error) {
                    console.log("❌ Test 1: Valid input\nResult: FAIL\nError:", err_1.message, "\n");
                }
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, createAppointment({
                        userId: "user_abc",
                        title: "",
                        date: new Date(),
                        time: "09:00",
                        notes: "Test",
                        reminder: true,
                    })];
            case 5:
                _a.sent();
                console.log("❌ Test 2: Empty title\nResult: FAIL (no error thrown)\n");
                return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                if (err_2 instanceof Error) {
                    console.log("✅ Test 2: Empty title\nResult: PASS\nError:", err_2.message, "\n");
                }
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, createAppointment({
                        userId: "user_abc",
                        title: "Old Appointment",
                        date: new Date("2022-01-01"),
                        time: "09:00",
                        notes: "Old",
                        reminder: true,
                    })];
            case 8:
                _a.sent();
                console.log("❌ Test 3: Past date\nResult: FAIL (no error thrown)\n");
                return [3 /*break*/, 10];
            case 9:
                err_3 = _a.sent();
                if (err_3 instanceof Error) {
                    console.log("✅ Test 3: Past date\nResult: PASS\nError:", err_3.message, "\n");
                }
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); })();
