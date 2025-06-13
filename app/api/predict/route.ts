export async function POST(req: Request) {
    const {text}=await req.json();
    const res=await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers:{'content-type': 'application/json'},
        body: JSON.stringify({text})
    })

    const result = await res.json();
    return new Response(JSON.stringify(result));
}