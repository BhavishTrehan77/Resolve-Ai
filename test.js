require("dotenv").config();

const mongoose = require("mongoose");
const { ragChat } = require("./ai/rag/rag.service");


const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const result = await ragChat(
            "What technical skills does Aayaan Choudhary have?"
        );

        console.log("\nANSWER:\n");
        console.log(result.answer);

        console.log("\nSOURCES:\n");
        console.log(result.sources);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();