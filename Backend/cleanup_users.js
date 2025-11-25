const db = require("./Configs/db");

// List of emails to delete
const emailsToDelete = [
    'jalebi12@jklu.edu.in',
    'jalebi@jklu.edu.in',
    'kiwi@jklu.edu.in',
    'test123@jklu.edu.in',
    'test@jklu.edu.in'
];

const deleteUsers = async () => {
    console.log("Starting user cleanup...");
    console.log("Emails to delete:", emailsToDelete);

    try {
        for (const email of emailsToDelete) {
            await new Promise((resolve, reject) => {
                // First, get the user_id to delete related data
                db.query("SELECT user_id FROM users WHERE email = ?", [email], (err, rows) => {
                    if (err) {
                        console.error(`Error finding user ${email}:`, err);
                        reject(err);
                        return;
                    }

                    if (rows.length === 0) {
                        console.log(`User ${email} not found, skipping...`);
                        resolve();
                        return;
                    }

                    const userId = rows[0].user_id;
                    console.log(`Found user ${email} with ID ${userId}`);

                    // Delete related data first (complaints, comments, etc.)
                    // Delete comments by this user
                    db.query("DELETE FROM comments WHERE user_id = ?", [userId], (err) => {
                        if (err) console.error(`Error deleting comments for ${email}:`, err);
                        else console.log(`Deleted comments for ${email}`);

                        // Delete status history by this user
                        db.query("DELETE FROM status_history WHERE changed_by = ?", [userId], (err) => {
                            if (err) console.error(`Error deleting status history for ${email}:`, err);
                            else console.log(`Deleted status history for ${email}`);

                            // Delete complaints by this user
                            db.query("DELETE FROM complaints WHERE user_id = ?", [userId], (err) => {
                                if (err) console.error(`Error deleting complaints for ${email}:`, err);
                                else console.log(`Deleted complaints for ${email}`);

                                // Delete feedback by this user
                                db.query("DELETE FROM feedback WHERE user_id = ?", [userId], (err) => {
                                    if (err) console.error(`Error deleting feedback for ${email}:`, err);
                                    else console.log(`Deleted feedback for ${email}`);

                                    // Finally, delete the user
                                    db.query("DELETE FROM users WHERE user_id = ?", [userId], (err) => {
                                        if (err) {
                                            console.error(`Error deleting user ${email}:`, err);
                                            reject(err);
                                        } else {
                                            console.log(`✅ Successfully deleted user ${email}`);
                                            resolve();
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }

        console.log("\n✅ User cleanup completed successfully!");
        console.log("All specified users and their related data have been deleted.");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Error during cleanup:", err);
        process.exit(1);
    }
};

// Run the cleanup
deleteUsers();
