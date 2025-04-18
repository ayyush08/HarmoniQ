from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoProcessor, MusicgenForConditionalGeneration, TextToAudioPipeline
import torch
import io
import soundfile as sf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[INFO] Using device: {device}")

model = MusicgenForConditionalGeneration.from_pretrained(
    "facebook/musicgen-small",
    attn_implementation="eager",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32  
).to(device)

processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
synthesizer = TextToAudioPipeline(model=model, processor=processor)

@app.post("/generate")
async def generate(prompt_req: PromptRequest):
    prompt = prompt_req.prompt
    print(f"[INFO] Generating music for: {prompt}")

    try:
        result = synthesizer(
            prompt,
            forward_params={
                "do_sample": True,
                "max_new_tokens": 1024  
            }
        )

        audio = result["audio"].squeeze()
        sampling_rate = result["sampling_rate"]

        buffer = io.BytesIO()
        sf.write(buffer, audio, samplerate=sampling_rate, format="FLAC")
        buffer.seek(0)

        return Response(
            content=buffer.read(),
            media_type="audio/flac",
            headers={"Content-Disposition": "inline; filename=musicgen.flac"}
        )
    except Exception as e:
        print("[ERROR]", str(e))
        return Response(content="Error during generation", status_code=500)
