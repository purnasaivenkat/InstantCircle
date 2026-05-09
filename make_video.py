import os
import asyncio
import edge_tts
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

# --- SETUP YOUR VIDEO HERE ---
SCENES = [
    {
        "image": "screenshots/home.png",
        "text": "Imagine opening a social app that doesn’t ask who you are… but instead asks how you feel. Introducing Instant Circle — a modern emotional connection platform built for instant, judgment-free conversations. Unlike traditional social media platforms driven by profiles, followers, and endless scrolling, Instant Circle focuses on something simpler and more human — emotional connection in the moment. The experience begins with a clean and immersive landing page designed to create a calm nighttime atmosphere. The interface immediately communicates the platform’s core idea — a quiet space for deep conversations.",
    },
    {
        "image": "screenshots/signup.png",
        "text": "Users can either start a session instantly or log into their account securely. The authentication flow is intentionally minimal and frictionless. New users can create an account within seconds using only a username, email, and password. Existing users can log in quickly and continue their experience seamlessly.",
    },
    {
        "image": "screenshots/options.png",
        "text": "Once inside, the platform asks a simple but emotionally powerful question: ‘What’s on your mind tonight?’ Instead of joining random chat rooms, users select a mood-based circle depending on how they feel. Release Thoughts — for users who want to vent and express emotions openly. Light Talk — for casual and relaxed conversations. Seeking Light — for people looking for advice, comfort, or emotional support. Drift Away — for peaceful and quiet companionship. This emotional categorization creates a more intentional and meaningful social experience compared to traditional anonymous chat platforms.",
    },
    {
        "image": "screenshots/dashboard.png",
        "text": "After selecting a mood, users enter a smart matchmaking flow where the system connects them with companions who share similar emotional intent. The waiting experience is designed to feel calm and reassuring rather than frustrating. Real-time indicators show active users joining the circle, creating anticipation and emotional engagement.",
    },
    {
        "image": "screenshots/chatwithai.png",
        "text": "Once matched, users enter a minimal real-time chat interface designed to reduce distractions and focus completely on conversation. The dark UI, smooth interactions, and anonymous environment create a safe digital space where users can communicate openly without social pressure.",
    },
    {
        "image": "screenshots/chatbot.png",
        "text": "However, while analyzing the product, several important product and UX insights were identified. One major friction point is the lack of onboarding guidance for first-time users. New users may not immediately understand the purpose of different emotional circles or the type of conversations expected inside them. Another challenge is long-term retention. While Instant Circle creates strong instant engagement, the platform currently lacks personalized systems that encourage users to return regularly.",
    },
    {
        "image": "screenshots/home.png",
        "text": "To solve this, we propose a high-ROI feature called Mood Pulse AI. Mood Pulse AI intelligently analyzes a user’s current emotional state, conversation preference, and energy level before recommending the most suitable circles and companions. Instead of random matching, users receive emotionally relevant connections and AI-generated conversation starters, significantly improving conversation quality and user satisfaction. This feature has the potential to improve higher retention, longer session duration, better emotional engagement, and stronger user loyalty.",
    },
    {
        "image": "screenshots/home.png",
        "text": "From a product perspective, Instant Circle stands out because it combines emotional intelligence, minimal design, and real-time social interaction into one lightweight experience. In a world dominated by noisy social media platforms, Instant Circle creates something rare — a quiet digital sanctuary for authentic human connection.",
    }
]

# You can change the voice. Some good ones: 
# en-US-ChristopherNeural (Male), en-US-AriaNeural (Female), en-GB-SoniaNeural (British Female)
VOICE = "en-US-ChristopherNeural" 
# ------------------------------

async def generate_audio(text, filename):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(filename)

async def main():
    print("Starting AI Video generation...")
    
    # Create an audio folder for temporary voice files
    if not os.path.exists("audio_temp"):
        os.makedirs("audio_temp")
        
    clips = []
    
    for i, scene in enumerate(SCENES):
        image_path = scene["image"]
        if not os.path.exists(image_path):
            print(f"ERROR: Could not find image '{image_path}'. Make sure it's in the screenshots folder.")
            return

        print(f"Generating AI voice for scene {i+1}...")
        audio_file = f"audio_temp/scene_{i}.mp3"
        
        # Generate the voiceover
        await generate_audio(scene["text"], audio_file)
        audio_clip = AudioFileClip(audio_file)
        
        # Force a minimum duration for each scene to reach 4.5 minutes (270 seconds) total
        target_scene_duration = 270 / len(SCENES)
        scene_duration = max(audio_clip.duration, target_scene_duration)
        
        # Create a video clip from the image
        print(f"Processing image {image_path}...")
        img_clip = ImageClip(image_path).set_duration(scene_duration)
        img_clip = img_clip.set_audio(audio_clip)
        
        clips.append(img_clip)

    print("Stitching scenes together...")
    final_video = concatenate_videoclips(clips, method="compose")
    
    print("Saving final_video.mp4... (This might take a minute)")
    final_video.write_videofile(
        "final_video.mp4", 
        fps=2,
        codec="libx264",
        audio_codec="aac"
    )
    print("Done! Your video is ready: final_video.mp4")

if __name__ == "__main__":
    asyncio.run(main())
