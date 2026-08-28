# Hostel HQ | AI-Powered Smart Campus RAG Assistant

**Hostel HQ** is a production-grade, multimodal Retrieval-Augmented Generation (RAG) web application designed to streamline student life and administrative operations in residential student housing. Built for multi-device environments, it combines high-performance vector search with conversational AI, voice accessibility, and document intelligence.

---

## 🚀 Tech Stack & Architecture

* **Backend Engine**: Node.js, Express.js (Hosted live on Render)
* **AI & Intelligence**: Google Gemini API (`Gemini 3.6-flash`)
* **Database & Vector Store**: Supabase (PostgreSQL with `pgvector` for semantic document retrieval)
* **Frontend UI**: Single-file responsive interface (`hostel-ui.html`) styled with **Tailwind CSS**
* **Multimodal Features**: Native Web Speech API (Speech-to-Text & Text-to-Speech) and file/image attachment parsing

---

## ✨ Key Features

1. **Semantic RAG Pipeline**: Queries vector-embedded hostel regulations, cafeteria timetables, emergency contacts, and housing guidelines stored securely in Supabase.
2. **Multimodal AI Capabilities**: Users can interact via typed text, voice dictation (Speech-to-Text), audio read-aloud playback (Text-to-Speech), or by attaching images, videos, and documents.
3. **Cross-Device Responsive Grid**: Implements a fluid, mobile-first 12-column layout that adapts seamlessly across smartwatches, smartphones, tablets, and desktop displays.
4. **Hostelry Gold & Green Design Language**: Features an elite student-portal aesthetic with warm radiant gradients, sophisticated serif typography (`Newsreader`), and high-contrast accessibility compliance.

---

## 🛠️ Project Structure

```text
hostel-hq-rag/
├── server/               # Node.js/Express backend service & RAG endpoints
├── hostel-ui.html        # Multimodal responsive frontend interface
├── .gitignore            # Git exclusion rules
└── README.md             # Project documentation
