const express=require("express");
const app=express();
const authRoutes=require("./routes/auth.routes");
const habitRoutes=require("./routes/habits.routes");
const adminRoutes=require("./routes/admin.routes");
var cookieParser = require('cookie-parser');
const cors=require("cors");

// Secure CORS setup for frontend access
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND,
].filter(Boolean);

// ✅ CORS middleware FIRST
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true,
}));

// ✅ VERY IMPORTANT: handle preflight
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/habits',habitRoutes);
app.use('/api/admin',adminRoutes);

module.exports=app;