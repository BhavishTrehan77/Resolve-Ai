const bcrypt = require('bcrypt');
const User = require('../modules/user/user.schema');

const bootstrapDefaultUsers = async () => {
    try {
        const defaultUsers = [
            {
                name: "System Admin",
                email: "admin@resolve.ai",
                password: "Admin@123",
                role: "ADMIN"
            },
            {
                name: "Support Agent",
                email: "agent@resolve.ai",
                password: "Agent@123",
                role: "AGENT"
            },
            {
                name: "Staff Employee",
                email: "employee@resolve.ai",
                password: "Employee@123",
                role: "EMPLOYEE"
            }
        ];

        for (const u of defaultUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await User.create({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    role: u.role
                });
                console.log(`[BOOTSTRAP] Created default ${u.role} user: ${u.email}`);
            }
        }
    } catch (err) {
        console.error("[BOOTSTRAP] Error seeding initial users:", err.message);
    }
};

module.exports = {
    bootstrapDefaultUsers
};
