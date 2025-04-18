# 🎵 HarmoniQ - An AI Sound Designer

- HarmoniQ is a Next.js application that provides an interface for users to generate sounds of their choice using a simple prompt. The application uses a combination of Gemini and Hugging Face APIs to generate the sounds and display them in a user-friendly manner. 🎧
- The application is designed to be easy to use, with a simple and intuitive interface that allows users to quickly generate sounds without any technical knowledge. 🚀

## ✨ Features
- 🖥️ User-friendly interface for sound generation
- 🔗 Integration with Gemini and Hugging Face APIs for sound generation
- 🎤 Ability to generate sounds based on user prompts
- 🎶 Display of generated sounds in a user-friendly manner
- 📥 Downloadable sound files for user convenience

## 🛠️ Technologies Used

### 🌟 Gemini API (model: gemini-1.5-flash)
 For enhancing the user prompt to provide a better prompt to send on to the Hugging Face API

### 🤖 Hugging Face Model (model: facebook/musicgen-small) 
 For generating the sound based on the user prompt

### ⚛️ Next.js
- A React framework for building server-side rendered applications
- Provides a simple and efficient way to build web applications with server-side rendering and static site generation

### Database
- MongoDB (for storing user data and generated sounds)



## 🚀 Installation

1. Clone the repository to your local machine
```bash
     https://github.com/ayyush08/HarmoniQ.git
```

2. Navigate to the project directory
```bash
     cd HarmoniQ
```

3. Install the required dependencies
```bash
     npm install
```

4. Create a `.env` file in the root directory and add your API keys
```bash
     NEXT_PUBLIC_HF_API_KEY=your_huggingface_api_key
     GEMINI_API_KEY=your_gemini_api_key
```

5. Start the development server
```bash
     npm run dev
```

6. Open your browser and navigate to `http://localhost:3000` to view the application 🌐

## 💬 Feedback

If you have any feedback or suggestions for improving the application, please feel free to reach out. Your input is greatly appreciated and will help us make HarmoniQ even better! 🙌
