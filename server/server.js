const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and handle cross-origin requests
app.use(cors());
app.use(express.json());

// Initialize Supabase securely using your Render Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey) 
        : null;

        // Initialize Google Gemini securely
        const ai = process.env.GEMINI_API_KEY 
            ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
                : null;

                // Upgraded Health Check Route
                app.get('/api/health', (req, res) => {
                    res.json({
                            status: "ok",
                                    message: "Hostel HQ AI Assistant Backend is live!",
                                            services: {
                                                        supabase_connected: !!supabase,
                                                                    gemini_connected: !!ai
                                                                            }
                                                                                });
                                                                                });

                                                                                // Start the Express Engine
                                                                                app.listen(port, () => {
                                                                                    console.log(`Server is running on port ${port}`);
                                                                                    });
                                                                                    