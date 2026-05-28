import { MongoClient } from "mongodb";

const mongoUrl = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (!mongoUrl) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(mongoUrl);
  await client.connect();
  return client;
}

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db("winger");
    const watchlist = db.collection("watchlist");

    // Check if email already exists
    const existing = await watchlist.findOne({ email });
    if (existing) {
      return Response.json(
        { error: "Email already joined the watchlist" },
        { status: 409 }
      );
    }

    // Insert new watchlist entry
    const result = await watchlist.insertOne({
      email,
      joinedAt: new Date(),
    });

    return Response.json(
      {
        success: true,
        message: "Successfully joined the watchlist!",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Watchlist API error:", error);
    return Response.json(
      { error: "Failed to join watchlist. Please try again." },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
