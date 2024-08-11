import { connection } from "../server.js";

export const getCandidates = (req, res) => {
  try {
    connection.query("SELECT * FROM candidate", async (err, results) => {
      if (err) {
        console.error("Error fetching candidates:", err);
        return res
          .status(500)
          .json({ ok: false, message: "Failed to fetch candidates" });
      }

      const candidates = await Promise.all(
        results.map(
          (candidate) =>
            new Promise((resolve, reject) => {
              connection.query(
                "SELECT * FROM user WHERE user_id=?",
                [candidate.user_id],
                (err, c) => {
                  if (err) {
                    console.error("Error fetching candidate:", err);
                    return reject(
                      new Error("Failed to fetch user for candidates")
                    );
                  }

                  // Combine voter and user data
                  const candidateData = {
                    ...c[0],
                    position: candidate.position,
                    candidate_id: candidate.candidate_id,
                    description: candidate.description,
                    party: candidate.party,
                  };

                  resolve(candidateData);
                }
              );
            })
        )
      );

      // Send the combined voters and users data as an array
      return res.status(200).json({
        ok: true,
        data: candidates,
      });
    });
  } catch (error) {
    console.error("Error getting candidates:", error);
    return res.status(500).json({ error: "Failed to get candidates" });
  }
};
