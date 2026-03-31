const express=require("express");
const app=express();
const authRoutes=require("./routes/auth.routes");
const habitRoutes=require("./routes/habits.routes");
const adminRoutes=require("./routes/admin.routes");
var cookieParser = require('cookie-parser');
const cors=require("cors");

app.use(express.json());
app.use(cookieParser());

// Secure CORS setup for frontend access
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests like Postman / mobile apps (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));


app.use('/api/auth',authRoutes);
app.use('/api/habits',habitRoutes);
app.use('/api/admin',adminRoutes);

module.exports=app;