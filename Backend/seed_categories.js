const db = require("./Configs/db");

const categories = [
    { name: "Academics", department_id: 1 },
    { name: "Hostel", department_id: 3 },
    { name: "Mess/Cafeteria", department_id: 3 },
    { name: "IT & Technical problems", department_id: 2 },
    { name: "Transport", department_id: 2 },
    { name: "Maintenance", department_id: 2 },
    { name: "Sports", department_id: 3 },
    { name: "Clubs & Societies", department_id: 3 },
    { name: "Events & campus activities", department_id: 3 },
    { name: "Admin", department_id: 2 }
];

// We also need departments if they don't exist
const departments = [
    { id: 1, name: "Academics" },
    { id: 2, name: "Administration" },
    { id: 3, name: "Student Affairs" }
];

const seed = async () => {
    console.log("Seeding...");

    // Seed Departments
    for (const dept of departments) {
        await new Promise((resolve) => {
            db.query(
                "INSERT IGNORE INTO departments (department_id, name) VALUES (?, ?)",
                [dept.id, dept.name],
                (err) => {
                    if (err) console.error(err.message);
                    resolve();
                }
            );
        });
    }

    // Seed Categories
    for (const cat of categories) {
        await new Promise((resolve) => {
            db.query(
                "INSERT IGNORE INTO categories (name, department_id) VALUES (?, ?)",
                [cat.name, cat.department_id],
                (err) => {
                    if (err) console.error(err.message);
                    resolve();
                }
            );
        });
    }

    console.log("Seeding complete.");
    process.exit();
};

seed();
