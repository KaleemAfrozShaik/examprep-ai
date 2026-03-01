import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" })
        }
        const user = req.user;
        
        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }

        if (user.credits < 10) {
            return res.status(403).json({
                message: "Insufficient credits"
            });
        }

        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        })

        // Atomic deduction
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, credits: { $gte: 10 } },
            { 
                $inc: { credits: -10 },
                // We'll update isCreditsAvailable based on the NEW credit count after deduction
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(403).json({ message: "Insufficient credits" });
        }

        // If credits dropped to 0 or less (though $gte 10 should prevent < 0 if strictly 10), update flag
        if (updatedUser.credits < 10) {
            await UserModel.findByIdAndUpdate(user._id, { $set: { isCreditsAvailable: false } });
        }

        let aiResponse;
        try {
            aiResponse = await generateGeminiResponse(prompt)
        } catch (aiError) {
            // Refund credits if AI fails
            await UserModel.findByIdAndUpdate(user._id, { $inc: { credits: 10 }, $set: { isCreditsAvailable: true } });
            throw aiError;
        }
        
        const notes = await Notes.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse
        })

        await UserModel.findByIdAndUpdate(user._id, {
            $push: { notes: notes._id }
        });

        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id,
            creditsLeft: updatedUser.credits - 0 // Ensure it's the value after deduction
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({
        error: "AI generation failed",
        message: error.message
    });

    }
}
