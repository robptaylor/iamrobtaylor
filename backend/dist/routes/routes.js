"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generation_1 = require("../controllers/generation");
const router = (0, express_1.Router)();
router.get('/generation_pct/last24h', generation_1.last24hPct);
exports.default = router;
//# sourceMappingURL=routes.js.map