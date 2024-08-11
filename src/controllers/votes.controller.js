import { connection } from "../../src/server.js";

export const votes = async (req, res) => {
  try {
    // Query to get vote counts along with candidate details
    connection.query("SELECT * FROM candidate", async (err, results) => {
      if (err) {
        console.error("Error fetching voters:", err);
        return res
          .status(500)
          .json({ ok: false, message: "Failed to fetch voters" });
      }

      const candidates = await Promise.all(
        results.map(
          (candidate) =>
            new Promise((resolve, reject) => {
              connection.query(
                "SELECT * FROM user WHERE user_id=?",
                [candidate.user_id],
                (err, candidates) => {
                  if (err) {
                    console.error("Error fetching candidates:", err);
                    return reject(
                      new Error("Failed to fetch user for candidate")
                    );
                  }

                  connection.query(
                    "select count(*) as vote_count from vote where candidate_id = ?",
                    [candidate.user_id],
                    (err, voteCount) => {
                      if (err) {
                        console.error("Error fetching vote count:", err);
                        return reject(
                          new Error("Failed to fetch vote count for candidate")
                        );
                      }

                      // Combine voter and user data
                      const candidateData = {
                        ...candidates[0],
                        vote_count: voteCount[0],
                      };

                      resolve(candidateData);
                    }
                  );

                  // // Combine voter and user data
                  // const voterData = {
                  //   ...candidates[0],
                  //   vote_count:
                  // };

                  // resolve(voterData);
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const castVote = async (req, res) => {
  const { voteData: votes, voter_id } = req.body;

  console.log("This is voter id ", voter_id);
  console.log("This is votedata ", votes);
  if (!Array.isArray(votes) || votes.length === 0) {
    return res.status(400).json({ error: "No votes provided" });
  }

  connection.query(
    "UPDATE voter SET voted=1 WHERE user_id=?",
    [voter_id],
    (err, results) => {
      if (err) {
        console.error("Error updating voter:", err);
      }
      console.log("This is query results", results);
    }
  );

  try {
    connection.beginTransaction();

    for (const vote of votes) {
      const { candidateId, voterId } = vote;

      console.log("This is vote", vote);

      // Insert each vote into the database
      connection.query(
        "INSERT INTO vote (candidate_id, voter_id) VALUES (?, ?)",
        [candidateId, voterId]
      );
    }

    connection.commit();

    return res
      .status(200)
      .json({ ok: true, message: "Votes submitted successfully" });
  } catch (error) {
    connection.rollback();
    console.error("Error submitting votes:", error);
  }
};

export const voteCount = async (req, res) => {
  try {
    connection.query(
      `SELECT 
         u.firstName, 
         u.lastName, 
         c.position, 
         COUNT(v.candidate_id) AS vote_count
       FROM vote v
       JOIN candidate c ON v.candidate_id = c.candidate_id
       JOIN user u ON c.user_id = u.user_id
       GROUP BY u.firstName, u.lastName, c.position
       ORDER BY vote_count DESC`,
      (err, results) => {
        if (err) {
          console.error("Error fetching vote count:", err);
          return res
            .status(500)
            .json({ ok: false, message: "Failed to fetch vote count" });
        }

        console.log("Vote count results: ", results);

        return res.status(200).json({
          ok: true,
          data: results,
        });
      }
    );
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to fetch vote count" });
  }
};
