const habitModel=require("../models/habit.model");
const habitPostModel=require("../models/habitPost.model");
const {uploadFile,deleteFile}=require("../services/storage.service");
const streakCounter=require("../utils/streakCalculator");


async function createHabit(req,res){
    try{
        const {name,color="#FFB347"}=req.body;
        if(!name){
            return res.status(400).json({message:"Habit name not specified"})
        }
    
        const existingHabit=await habitModel.findOne({
            user:req.user.id,
            name
        });
        if (existingHabit){
            return res.status(409).json({
                message: "Habit already exists"
            });
        }
    
        const colorRegex=/^#([0-9A-F]{3}){1,2}$/i;
        const validColor = color?colorRegex.test(color):true;
        if(!validColor){
            return res.status(400).json({
                message:"Invalid color"
            })
        }
    
        const habit=await habitModel.create({
            user:req.user.id,
            name,
            color
        })
        return res.status(201).json({
            message: "Habit created successfully",
            habit
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function logHabit(req,res){
    try {
        const habitId=req.params.id;
        const id=req.user.id;
        const file=req.file;
        if(!file){
            return res.status(400).json({
                message:"Image is Required"
            })
        }
        
        const habit=await habitModel.findById(habitId);
        if(!habit){
            return res.status(404).json({
                message:"Habit Not Found"
            })
        }
        if(habit.user.toString()!==id.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
        
        const today=new Date();
        today.setHours(0,0,0,0);
        
        const todayStr = today.toDateString();
        const parts=todayStr.split(' ');
        const titleDate=`${parts[2]} ${parts[1].toLowerCase()}`;
        
        const result=await uploadFile(file.buffer.toString('base64'),file.mimetype);
        if (!result || !result.url){
            throw new Error("Upload failed");
        }
    
        const post=await habitPostModel.create({
            habit:habitId,
            user:id,
            uri:result.url,
            fileId:result.fileId,
            title:req.body.title||titleDate,
            date:today
        })

        const posts=await habitPostModel.find({
            habit:habitId,
            user:id
        }).sort({createdAt:-1});
        
        const {currentStreak,longestStreak,count}=streakCounter(posts)

        habit.count=count;
        habit.streak=currentStreak;
        habit.longestStreak=longestStreak
        habit.lastEntryDate = today;

        await habit.save();

        return res.status(201).json({
            message: "Habit logged successfully",
            count: habit.count,
            currentStreak: habit.streak,
            longestStreak: habit.longestStreak,
            post
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function changeColor(req,res){
    try {
        const {id}=req.params;
        const {color}=req.body;
        if(!color) {
            return res.status(400).json({
                message: "Color is required"
            });
        }

        const colorRegex=/^#([0-9A-F]{3}){1,2}$/i;
        const isValidColor=colorRegex.test(color);
        if(!isValidColor){
            return res.status(400).json({
                message:"Color Invalid"
            })
        }

        const habit=await habitModel.findById(id);
        if(!habit){
            return res.status(404).json({
                message:"Habit Not Found"
            })
        }
        if(habit.user.toString() !== req.user.id.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
    
        habit.color=color;
        await habit.save();

        return res.status(200).json({
            message: "Color updated successfully",
            habit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deleteHabitLog(req,res){
    try {
        const {postId}=req.params;
        const userId=req.user.id;

        const post =await habitPostModel.findOne({
            _id:postId,
            user:userId
        });
        if(!post){
            return res.status(404).json({ message: "Habit Post not found" });
        }
        if(post.user.toString()!==userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        try{
            if(post.fileId){
                await deleteFile(post.fileId);
            }
        } 
        catch (err) {
            console.log("File Deletion failed");
        }
    
        await post.deleteOne();
    
        const habitId = post.habit;
        const habit = await habitModel.findById(habitId);
        if (!habit){
            return res.status(404).json({ message: "Habit not found"});
        }

        const posts=await habitPostModel.find({
            habit: habitId,
            user: userId
        }).sort({createdAt:-1});
    
        const {currentStreak,longestStreak,count}=streakCounter(posts);
        habit.streak = currentStreak;
        habit.longestStreak = longestStreak;
        habit.count = count;
        habit.lastEntryDate =posts.length?posts[0].createdAt:null;
    
        await habit.save();
    
        return res.json({
            message: "Post deleted and count updated",
            count: habit.count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deleteHabit(req,res){
    try {
        const {habitId}=req.params;
        const userId=req.user.id;

        const habit=await habitModel.findById(habitId);
        if(!habit){
            return res.status(404).json({ message: "Habit not found"});
        }
        if(habit.user.toString()!==userId.toString()){
            return res.status(403).json({ message: "Unauthorized" });
        }

        const posts=await habitPostModel.find({
            habit:habitId,
            user:userId
        });

        //deleting all images of all the posts in that habit
        await Promise.all(
            posts.map(post => post.fileId ? deleteFile(post.fileId) : null)
        );

        await habitPostModel.deleteMany({habit:habitId});

        await habit.deleteOne();

        return res.status(200).json({
            message: "Habit deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getHabits(req, res) {
    try {
        const userId = req.user.id;

        const habits = await habitModel.aggregate([
            {
                $match: {
                    user: new require("mongoose").Types.ObjectId(userId)
                }
            },

            // 🔗 Join posts
            {
                $lookup: {
                    from: "habitPostModel", // collection name (IMPORTANT)
                    localField: "_id",
                    foreignField: "habit",
                    as: "posts"
                }
            },

            // 🧹 Keep only needed fields
            {
                $addFields: {
                    posts: {
                        $map: {
                            input: "$posts",
                            as: "p",
                            in: {
                                createdAt: "$$p.createdAt"
                            }
                        }
                    }
                }
            },

            // 📊 Sort posts newest first
            {
                $addFields: {
                    posts: {
                        $sortArray: {
                            input: "$posts",
                            sortBy: { createdAt: -1 }
                        }
                    }
                }
            }
        ]);

        // 🔥 Now compute streak in JS (fast, no DB calls)
        const updatedHabits = habits.map(habit => {
            const { currentStreak, longestStreak, count } = streakCounter(habit.posts);

            return {
                ...habit,
                streak: currentStreak,
                longestStreak,
                count,
                lastEntryDate: habit.posts.length ? habit.posts[0].createdAt : null
            };
        });

        return res.status(200).json({
            message: "Habits fetched successfully",
            count: updatedHabits.length,
            habits: updatedHabits
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getHabitPosts(req,res){
    try {
        const {habitId}=req.params;
        const userId=req.user.id;
    
        const habit=await habitModel.findOne({
            _id:habitId,
            user:userId
        });
        if(!habit){
            return res.status(404).json({
                message: "Habit not found or unauthorized"
            });
        }

        const posts=await habitPostModel.find({
            habit:habitId,
            user:userId
        }).sort({date:-1, createdAt:-1});
    
        return res.status(200).json({
            message: "Posts fetched successfully",
            count: posts.length,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function updateHabitName(req,res){
    try{
        const {habitId}=req.params;
        const {newName}=req.body;
        const userId=req.user.id;
    
        const habit=await habitModel.findOne({
            _id:habitId,
            user:userId
        });
        if(!habit){
            return res.status(404).json({message:"Habit Not found"});
        }
        if(!newName){
            return res.status(400).json({ message: "New name is required" });
        }
        if(habit.user.toString()!==userId.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
    
        habit.name=newName;
        await habit.save();
    
        return res.json({message:"Habit Name Changed Successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function updatePostTitle(req,res){
    try{
        const {postId}=req.params;
        const {newName}=req.body;
        const userId=req.user.id;
    
        const post=await habitPostModel.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post Not found"});
        }
        if(!newName){
            return res.status(400).json({ message: "New name is required" });
        }
        if(post.user.toString() !== userId.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
    
        post.title=newName;
        await post.save();
    
        return res.json({message:"Habit Log changed successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports={createHabit, changeColor,logHabit, deleteHabitLog, deleteHabit,getHabits,getHabitPosts,updateHabitName,updatePostTitle}