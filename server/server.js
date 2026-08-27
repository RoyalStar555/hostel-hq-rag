const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.get('/api/health', (req, res) => {
    res.json({
            status: "ok",
                    message: "Hostel HQ AI Assistant Backend is live!",
                            services: { supabase_connected: !!supabase, gemini_connected: !!ai }
                                });
                                });

                                // --- THE RAG CHAT ENDPOINT ---
                                app.post('/api/chat', async (req, res) => {
                                    try {
                                            const { message } = req.body;
                                                    if (!message) return res.status(400).json({ error: "Message is required" });

                                                            const embeddingResponse = await ai.models.embedContent({
                                                                        model: 'text-embedding-004',
                                                                                    contents: message,
                                                                                            });
                                                                                                    const queryEmbedding = embeddingResponse.embeddings[0].values;

                                                                                                            const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
                                                                                                                        query_embedding: queryEmbedding,
                                                                                                                                    match_threshold: 0.5,
                                                                                                                                                match_count: 5
                                                                                                                                                        });

                                                                                                                                                                if (matchError) throw matchError;

                                                                                                                                                                        let contextText = "No specific context found in the database.";
                                                                                                                                                                                if (documents && documents.length > 0) {
                                                                                                                                                                                            contextText = documents.map(doc => doc.content).join('\n\n');
                                                                                                                                                                                                    }

                                                                                                                                                                                                            const prompt = `You are the Hostel HQ AI Assistant. Answer the user's question based ONLY on the following context. If the answer is not in the context, apologize and say you do not have that information.\n\nContext:\n${contextText}\n\nQuestion: ${message}`;
                                                                                                                                                                                                                    
                                                                                                                                                                                                                            const chatResponse = await ai.models.generateContent({
                                                                                                                                                                                                                                        model: 'gemini-2.5-flash',
                                                                                                                                                                                                                                                    contents: prompt,
                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                    res.json({ answer: chatResponse.text });

                                                                                                                                                                                                                                                                        } catch (error) {
                                                                                                                                                                                                                                                                                console.error("Chat Error:", error);
                                                                                                                                                                                                                                                                                        res.status(500).json({ error: "Failed to process chat request" });
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                                            // --- TEMPORARY TEST SEED ROUTE ---
                                                                                                                                                                                                                                                                                            app.get('/api/seed', async (req, res) => {
                                                                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                                                                        const text = 'The Hostel HQ cafeteria serves breakfast from 7:00 AM to 9:00 AM daily. Dinner is served from 7:30 PM to 9:30 PM.';
                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                        const embeddingResponse = await ai.models.embedContent({
                                                                                                                                                                                                                                                                                                                                    model: 'text-embedding-004',
                                                                                                                                                                                                                                                                                                                                                contents: text,
                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                                const embedding = embeddingResponse.embeddings[0].values;

                                                                                                                                                                                                                                                                                                                                                                        const { error } = await supabase.from('hostel_documents').insert({
                                                                                                                                                                                                                                                                                                                                                                                    content: text,
                                                                                                                                                                                                                                                                                                                                                                                                embedding: embedding
                                                                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                                                                                if (error) throw error;
                                                                                                                                                                                                                                                                                                                                                                                                                        res.json({ success: true, message: "Test document added successfully to Supabase!" });
                                                                                                                                                                                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                                                                    console.error("Seed Error:", error);
                                                                                                                                                                                                                                                                                                                                                                                                                                            res.status(500).json({ error: "Failed to add document" });
                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                                                                                                                                                app.listen(port, () => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                    console.log(`Server is running on port ${port}`);
                                                                                                                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                    