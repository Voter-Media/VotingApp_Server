import { connectToDB } from "../db/index.js";
const hardcodedVotesData = [
  { candidate_id: "U005", voter_id: "U001", vote_id: 12345 },
];
export const votes = async (req, res) => {
  // const { voterId, candidateId } = req.body;

  const connection = connectToDB();

  const { candidate_id, voter_id, vote_id } = hardcodedVotesData;

  if (!candidate_id || !voter_id) {
    return res
      .status(400)
      .json({ message: "Candidate ID and Voter ID are required." });
  }

  try {
    // Check if the voter has already voted
    const voted = connection.query(
      "SELECT voted FROM voters WHERE voter_id = ?",
      [voter_id]
    );

    if (voted.length === 0) {
      return res.status(404).json({ message: "Voter not found." });
    }

    if (voted[0]) {
      return res.status(400).json({ message: "You have already voted." });
    }

    // Insert vote into the vote table
    connection.query(
      "INSERT INTO vote (candidate_id, date, voter_id,vote_id) VALUES (?, NOW(), ?)",
      [candidate_id, voter_id, vote_id]
    );

    // Update the voter's voted status
    connection.query("UPDATE voters SET voted = TRUE WHERE voter_id = ?", [
      voter_id,
    ]);

    // Optionally, update the candidate's vote count if a `votes` column exists
    connection.query(
      "UPDATE candidate SET votes = votes + 1 WHERE candidate_id = ?",
      [candidate_id]
    );

    res.status(200).json({ message: "Vote successfully cast." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
const castVote = async () => {
  const { votes } = req.body;

  if (!Array.isArray(votes) || votes.length === 0) {
    return res.status(400).json({ error: "No votes provided" });
  }

  const connection = connectToDB();

  try {
    connection.beginTransaction();

    for (const vote of votes) {
      const { candidateId, voterId } = vote;

      // Insert each vote into the database
      connection.query(
        "INSERT INTO vote (candidate_id, voter_id) VALUES (?, ?)",
        [candidateId, voterId]
      );
    }

    connection.connect();
    res.status(200).json({ ok: true, message: "Votes submitted successfully" });
  } catch (error) {
    connection.rollback();
    console.error("Error submitting votes:", error);
    res.status(500).json({ ok: false, error: "Failed to submit votes" });
  } finally {
    connection.release();
  }
};
