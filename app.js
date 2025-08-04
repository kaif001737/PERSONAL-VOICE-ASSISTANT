const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Mam...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Mam...");
    } else {
        speak("Good Evening Mam...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing your personal assistant Kaif...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    const command = message.toLowerCase().trim();
    
    const speakAndOpen = (text, url) => {
        speak(text);
        window.open(url, "_blank");
    };

    if (command.includes('hello') || command.includes('hi') || command.includes('hey')|| command.includes('Who are you?')) {
        speak("Hello Mam Iam Kaif your Personal assistant , how can I assist you today?");
    }
   

    // --- Open Websites ---
    else if (command.includes("open google")) {
        speakAndOpen("Opening Google...", "https://www.google.com");
    } 
    else if (command.includes("open youtube")) {
        speakAndOpen("Opening YouTube...", "https://www.youtube.com");
    } 
    else if (command.includes("open facebook")) {
        speakAndOpen("Opening Facebook...", "https://www.facebook.com");
    } 
    else if (command.includes("open gmail")) {
        speakAndOpen("Opening Gmail...", "https://mail.google.com");
    } 
    else if (command.includes("open twitter")) {
        speakAndOpen("Opening Twitter...", "https://twitter.com");
    } 
    else if (command.includes("open maps") || command.includes("location")) {
        speakAndOpen("Opening Google Maps...", "https://maps.google.com");
    }

    // --- Play Music ---
    else if (command.includes("play music") || command.includes("play song")) {
        const query = command.replace("play music", "").replace("play song", "").trim().replace(/\s+/g, "+");
        speakAndOpen(`Playing ${query} on YouTube`, `https://www.youtube.com/results?search_query=${query}`);
    }

    // --- Search ---
    else if (command.includes("wikipedia")) {
        const topic = command.replace("wikipedia", "").trim().replace(/\s+/g, "_");
        speakAndOpen(`Searching Wikipedia for ${topic}`, `https://en.wikipedia.org/wiki/${topic}`);
    } 
    else if (command.includes("what is") || command.includes("who is") || command.includes("what are") || command.includes("search for")) {
        const query = command.replace(/\s+/g, "+");
        speakAndOpen(`Searching Google for ${message}`, `https://www.google.com/search?q=${query}`);
    }

    // --- Time & Date ---
    else if (command.includes("time")) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak(`The current time is ${time}`);
    } 
    else if (command.includes("date")) {
        const date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        speak(`Today's date is ${date}`);
    }

    // --- Email ---
    else if (command.includes("send email to")) {
        const email = prompt("Enter the email address:");
        const subject = prompt("Enter the subject:");
        const body = prompt("Enter the message:");
        const mailLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailLink;
        speak("Opening your email client to send the message.");
    }

    // --- Weather (basic support) ---
    else if (command.includes("weather in")) {
        const location = command.replace("weather in", "").trim();
        const query = `weather in ${location}`.replace(/\s+/g, "+");
        speakAndOpen(`Searching for weather in ${location}`, `https://www.google.com/search?q=${query}`);
    }

    // --- Fun / Jokes ---
    else if (command.includes("tell me a joke")) {
        const jokes = [
            "Why don’t scientists trust atoms? Because they make up everything!",
            "Why was the computer cold? Because it left its Windows open!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!"
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    }

    // --- Calculator (browser-based) ---
    else if (command.includes("calculator")) {
        speakAndOpen("Opening calculator...", "https://www.google.com/search?q=calculator");
    }

    // --- Notepad (browser simulation) ---
    else if (command.includes("notepad")) {
        const note = prompt("What would you like me to write down?");
        const blob = new Blob([note], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "note.txt";
        link.click();
        speak("Note saved as text file.");
    }

    // --- Fallback ---
    else {
        const fallbackQuery = command.replace(/\s+/g, "+");
        speakAndOpen(`Here's what I found for ${message}`, `https://www.google.com/search?q=${fallbackQuery}`);
    }
}