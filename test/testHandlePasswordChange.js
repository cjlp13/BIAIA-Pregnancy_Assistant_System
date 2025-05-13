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
// ✅ Mock Supabase client
var supabase = {
    auth: {
        updateUser: function (params) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Simulate different responses based on the password
                if (params.password === "failauth") {
                    return [2 /*return*/, { data: null, error: { message: "Authentication failed" } }];
                }
                return [2 /*return*/, { data: { user: { id: "123" } }, error: null }];
            });
        }); },
    },
};
// ✅ Mock React state setters
var passwordError = "";
var passwordSuccess = "";
var currentPassword = "";
var newPassword = "";
var confirmPassword = "";
var setPasswordError = function (value) {
    passwordError = value;
};
var setPasswordSuccess = function (value) {
    passwordSuccess = value;
};
var setCurrentPassword = function (value) {
    currentPassword = value;
};
var setNewPassword = function (value) {
    newPassword = value;
};
var setConfirmPassword = function (value) {
    confirmPassword = value;
};
// ✅ Mock event
var mockEvent = {
    preventDefault: function () { },
};
// ✅ Inline logic copied from your page.tsx
function handlePasswordChange(e) {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setPasswordError("");
                    setPasswordSuccess("");
                    if (newPassword !== confirmPassword) {
                        setPasswordError("New passwords don't match");
                        return [2 /*return*/];
                    }
                    if (newPassword.length < 6) {
                        setPasswordError("Password must be at least 6 characters");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase.auth.updateUser({
                            password: newPassword,
                        })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    setPasswordSuccess("Password updated successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setPasswordError(error_1.message || "Failed to update password");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ✅ Run Manual Tests
(function () { return __awaiter(_this, void 0, void 0, function () {
    var test1Result, test2Result, test3Result, test4Result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("== Manual Unit Tests for handlePasswordChange ==\n");
                // Test 1: Passwords don't match
                passwordError = "";
                passwordSuccess = "";
                currentPassword = "oldpass";
                newPassword = "newpass";
                confirmPassword = "different";
                return [4 /*yield*/, handlePasswordChange(mockEvent)];
            case 1:
                _a.sent();
                test1Result = passwordError === "New passwords don't match" &&
                    passwordSuccess === "" ?
                    "PASS" : "FAIL";
                console.log("\u2705 Test 1: Passwords don't match\nResult: ".concat(test1Result, "\nError: ").concat(passwordError, "\nSuccess: ").concat(passwordSuccess, "\n"));
                // Test 2: Password too short
                passwordError = "";
                passwordSuccess = "";
                currentPassword = "oldpass";
                newPassword = "short";
                confirmPassword = "short";
                return [4 /*yield*/, handlePasswordChange(mockEvent)];
            case 2:
                _a.sent();
                test2Result = passwordError === "Password must be at least 6 characters" &&
                    passwordSuccess === "" ?
                    "PASS" : "FAIL";
                console.log("\u2705 Test 2: Password too short\nResult: ".concat(test2Result, "\nError: ").concat(passwordError, "\nSuccess: ").concat(passwordSuccess, "\n"));
                // Test 3: Successful password change
                passwordError = "";
                passwordSuccess = "";
                currentPassword = "oldpass";
                newPassword = "newpassword";
                confirmPassword = "newpassword";
                return [4 /*yield*/, handlePasswordChange(mockEvent)];
            case 3:
                _a.sent();
                test3Result = passwordError === "" &&
                    passwordSuccess === "Password updated successfully" &&
                    currentPassword === "" &&
                    newPassword === "" &&
                    confirmPassword === "" ?
                    "PASS" : "FAIL";
                console.log("\u2705 Test 3: Successful password change\nResult: ".concat(test3Result, "\nError: ").concat(passwordError, "\nSuccess: ").concat(passwordSuccess, "\n"));
                // Test 4: Supabase error
                passwordError = "";
                passwordSuccess = "";
                currentPassword = "oldpass";
                newPassword = "failauth";
                confirmPassword = "failauth";
                return [4 /*yield*/, handlePasswordChange(mockEvent)];
            case 4:
                _a.sent();
                test4Result = passwordError === "Authentication failed" &&
                    passwordSuccess === "" ?
                    "PASS" : "FAIL";
                console.log("\u2705 Test 4: Supabase error\nResult: ".concat(test4Result, "\nError: ").concat(passwordError, "\nSuccess: ").concat(passwordSuccess, "\n"));
                return [2 /*return*/];
        }
    });
}); })();
