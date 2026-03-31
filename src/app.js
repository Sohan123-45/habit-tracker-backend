const express=require("express");
const app=express();
const authRoutes=require("./routes/auth.routes");
const habitRoutes=require("./routes/habits.routes");
const adminRoutes=require("./routes/admin.routes");
var cookieParser = require('cookie-parser');
const cors=require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/habits',habitRoutes);
app.use('/api/admin',adminRoutes);

module.exports=app;