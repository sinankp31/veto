import app from './app/app.js';
import config from './configs/env.config.js';
import connectDB from './configs/db.config.js';

await connectDB();

app.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})



