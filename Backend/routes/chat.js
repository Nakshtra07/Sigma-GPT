import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "ghj",
            title: "Sample",
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

router.get('/threads', async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});

router.get('/threads/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({threadId});
        if (!thread) {
            return res.status(404).json({ error: "thread not found" });
        }
        return res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});

router.delete('/threads/:threadId', async (req, res) => {
    let {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread could not be deleted" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete" });
    }
});

router.post('/chat', async (req, res) => {
    let {threadId, message} = req.body;
    if (!threadId || !message) {
        return res.status(400).json({ error: "The required field is missing" });
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        }
        else {
            thread.messages.push({ role: "user", content: message });
        }

        // Save the thread first so we don't lose the user's message if the OpenAI call fails
        await thread.save();

        let openAIResponse;
        try {
            openAIResponse = await getOpenAIAPIResponse(message);
        } catch (apiErr) {
            console.error("OpenAI API call failed, using fallback:", apiErr);
            openAIResponse = "I'm sorry, I am having trouble connecting to my service right now. Please try again.";
        }

        thread.messages.push({ role: "assistant", content: openAIResponse });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply:openAIResponse});
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
});

export default router;