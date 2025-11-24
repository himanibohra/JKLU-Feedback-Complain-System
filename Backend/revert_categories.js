const db = require("./Configs/db");

// Script to update categories in the database
const updateCategories = async () => {
    console.log("Updating categories...");

    try {
        // 1. Revert "Mess/Cafeteria" back to "Mess"
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE categories SET name = 'Mess' WHERE name = 'Mess/Cafeteria'",
                (err, result) => {
                    if (err) {
                        console.error("Error updating Mess:", err.message);
                        reject(err);
                    } else {
                        console.log("✓ Reverted 'Mess/Cafeteria' to 'Mess'");
                        resolve(result);
                    }
                }
            );
        });

        // 2. Add "Cafeteria" as a separate category
        await new Promise((resolve, reject) => {
            db.query(
                "INSERT IGNORE INTO categories (name, department_id) VALUES ('Cafeteria', 2)",
                (err, result) => {
                    if (err) {
                        console.error("Error adding Cafeteria:", err.message);
                        reject(err);
                    } else {
                        console.log("✓ Added 'Cafeteria' category");
                        resolve(result);
                    }
                }
            );
        });

        // 3. Ensure "Transport" exists
        await new Promise((resolve, reject) => {
            db.query(
                "INSERT IGNORE INTO categories (name, department_id) VALUES ('Transport', 2)",
                (err, result) => {
                    if (err) {
                        console.error("Error adding Transport:", err.message);
                        reject(err);
                    } else {
                        console.log("✓ Ensured 'Transport' category exists");
                        resolve(result);
                    }
                }
            );
        });

        // Display all current categories
        await new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM categories ORDER BY name",
                (err, results) => {
                    if (err) {
                        console.error("Error fetching categories:", err.message);
                        reject(err);
                    } else {
                        console.log("\n📋 Current categories:");
                        console.table(results);
                        resolve(results);
                    }
                }
            );
        });

        console.log("\n✅ Categories updated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating categories:", error);
        process.exit(1);
    }
};

updateCategories();
