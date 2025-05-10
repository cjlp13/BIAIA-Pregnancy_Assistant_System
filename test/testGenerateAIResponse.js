"use strict";
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
var axios_1 = require("axios");
// Copied from your component
function generateAIResponse(message, profile) {
    return __awaiter(this, void 0, void 0, function () {
        var currentDate, dueDate, pregnancyWeek, prompt_1, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!profile) return [3 /*break*/, 4];
                    currentDate = new Date();
                    dueDate = new Date(profile.due_date);
                    pregnancyWeek = 40 - Math.floor((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
                    prompt_1 = "\nYou name is Bembang, assisting a user who is currently ".concat(pregnancyWeek, " weeks pregnant. Their due date is ").concat(dueDate, " Their name is ").concat(profile.name, ".  Their reported symptoms include: ").concat(profile.symptoms ? profile.symptoms.join(", ") : "None reported.", " and their allergies include: ").concat(profile.allergies ? profile.allergies.join(", ") : "None reported.", "\n\nWhen responding:\n- Offer clear, medically accurate advice in a calm, friendly, and empathetic tone.\n- If the user\u2019s question involves any symptoms or medical concerns, gently encourage them to reach out to a healthcare provider for personalized care, especially if the symptoms seem worrisome or severe. Always approach with kindness and concern for their well-being.\n- Keep your advice direct but comforting. \n- Use emojis to make it more readable\n- Give concise like somewhere around 30 words but complete answers. If you need to make it long, then do it. The user may adhd tendency so they might have low attention span. But don't tell them\n- Make important answer bold! \n- If they speak tagalog, use tagalog as language. Otherwise, use english.\n- \"Bembang\" means sex in english. It is also your name as an ai bot. \n- Don't be shy to tell sensitive topics. \n- If the user questions and talks about Sex, replace \"Sex\" as \"Bembang (Sex)\" and make sure to make that word bold. \n- Use bullet points and bold to break down information where it makes it easier for the user to follow. (Use \"\u2022\" as bullet)\n- Do not repeat the user\u2019s pregnancy details, symptoms, or allergies unless it's necessary for context, but always make sure the response is relevant to their current question.\n\nUser's question: \"").concat(message, "\"\n");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/gemini", { prompt: prompt_1 })];
                case 2:
                    response = _a.sent();
                    if (response.data && response.data.reply) {
                        return [2 /*return*/, response.data.reply];
                    }
                    else {
                        return [2 /*return*/, "Sorry, I'm having trouble getting a response from the AI."];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error contacting Gemini AI:", error_1);
                    return [2 /*return*/, "Sorry, I'm having trouble connecting to my AI assistant. Please try again later."];
                case 4: return [2 /*return*/, "I'm here to help with your pregnancy journey. You can ask me about your symptoms, diet recommendations, safe exercises, or general pregnancy information."];
            }
        });
    });
}
// Run tests
// Run tests
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var test1, test1Result, test2, test2Lower, mentionsAllergy, givesWarning, test2Result, test3, expectedTest3, test3Result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("== Manual Unit Tests for generateAIResponse ==\n");
                return [4 /*yield*/, generateAIResponse("i am craving for some mints and ", {
                        name: "Viviene",
                        due_date: "2025-07-01",
                        symptoms: ["nausea", "fatigue"],
                        allergies: ["nuts"]
                    })];
            case 1:
                test1 = _a.sent();
                test1Result = test1.includes("mint") && !test1.includes("nuts") ? "PASS" : "FAIL";
                console.log("\u2705 Test 1: Happy path\nResult: ".concat(test1Result, " \nResponse: ").concat(test1, "\n"));
                return [4 /*yield*/, generateAIResponse("i want to eat peanut brittle", {
                        name: "Viviene",
                        due_date: "2025-07-01",
                        symptoms: [],
                        allergies: ["nuts"]
                    })];
            case 2:
                test2 = _a.sent();
                test2Lower = test2.toLowerCase();
                mentionsAllergy = test2Lower.includes("nut") || test2Lower.includes("allergy") || test2Lower.includes("peanut");
                givesWarning = test2Lower.includes("not recommended") || test2Lower.includes("avoid") || test2Lower.includes("risk") || test2Lower.includes("🚫");
                test2Result = (mentionsAllergy && givesWarning) ? "PASS" : "FAIL";
                console.log("\u26A0\uFE0F Test 2: Allergy warning\nResult: ".concat(test2Result, " \nResponse: ").concat(test2, "\n"));
                return [4 /*yield*/, generateAIResponse("", null)];
            case 3:
                test3 = _a.sent();
                expectedTest3 = "I'm here to help with your pregnancy journey. You can ask me about your symptoms, diet recommendations, safe exercises, or general pregnancy information.";
                test3Result = test3 === expectedTest3 ? "PASS" : "FAIL";
                console.log("\u274C Test 3: No input + no profile\nResult: ".concat(test3Result, " \nResponse: ").concat(test3, "\n"));
                return [2 /*return*/];
        }
    });
}); })();
