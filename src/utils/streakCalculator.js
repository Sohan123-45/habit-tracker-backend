function streakCounter(posts){
    try{
        if(!posts||posts.length === 0){
            return {currentStreak:0,longestStreak:0,count:0};
        }
        
        const uniqueDays=[
            ...new Set(
                posts.map(p => {
                    const d = new Date(p.createdAt);
                    d.setHours(0,0,0,0);
                    return d.getTime(); // use timestamp instead of string
                })
            )
        ];

        uniqueDays.sort((a,b)=>b-a); //latest to oldest

        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        let currentStreak = 1;
        let longestStreak = 1;

        for(let i=1;i<uniqueDays.length;i++){
            const diffDays=Math.floor((uniqueDays[i-1]-uniqueDays[i])/MS_PER_DAY);

            if(diffDays===1)currentStreak+=1;
            else break;
        }

        let tempStreak=1;
        for(let i=1;i<uniqueDays.length;i++){
            const diffDays=Math.floor((uniqueDays[i-1]-uniqueDays[i])/MS_PER_DAY);

            if(diffDays===1)tempStreak+=1;
            else tempStreak=1;

            longestStreak=Math.max(longestStreak,tempStreak);
        }
        
        return {currentStreak,longestStreak,count:posts.length};
    }   
    catch(err){
        console.log(err);
    }
}
module.exports=streakCounter; 