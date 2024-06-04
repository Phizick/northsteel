from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Привет от FastAPI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
