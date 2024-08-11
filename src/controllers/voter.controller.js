import { connection } from "../server.js";

export const getVoters = async (req, res) => {
  try {
    connection.query("SELECT * FROM voter", async (err, results) => {
      if (err) {
        console.error("Error fetching voters:", err);
        return res
          .status(500)
          .json({ ok: false, message: "Failed to fetch voters" });
      }

      const voters = await Promise.all(
        results.map(
          (voter) =>
            new Promise((resolve, reject) => {
              connection.query(
                "SELECT * FROM user WHERE user_id=?",
                [voter.user_id],
                (err, users) => {
                  if (err) {
                    console.error("Error fetching user:", err);
                    return reject(new Error("Failed to fetch user for voter"));
                  }

                  // Combine voter and user data
                  const voterData = {
                    ...users[0],
                    voted: voter.voted,
                    voter_id: voter.voter_id,
                  };
                  resolve(voterData);
                }
              );
            })
        )
      );
      // Send the combined voters and users data as an array
      return res.status(200).json({
        ok: true,
        data: voters,
      });
    });
  } catch (error) {
    console.error("Error processing voters:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to process voters" });
  }
};

export const getVoter = async (req, res) => {
  try {
    connection.query(
      "SELECT * FROM voter WHERE user_id=?",
      [req.params.id],
      async (err, results) => {
        if (err) {
          console.error("Error fetching voter:", err);
          return res
            .status(500)
            .json({ ok: false, message: "Failed to fetch voter" });
        }

        return res.status(200).json({
          ok: true,
          voter: results[0],
        });
      }
    );
  } catch (error) {
    console.error("Error processing voter:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to process voter" });
  }
};
