import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../src/config/db';
import { seedRoles } from '../src/data/permissions';
import User from '../src/models/User';
import Role from '../src/models/Role';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if admin role exists
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      console.log('Admin role not found. Please run role seeding first.');
      return;
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@emr.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@emr.com',
      password: hashedPassword,
      role: adminRole._id,
      department: 'general',
      employee_id: 'EMP001',
      is_active: true
    });

    console.log('Default admin user created:', {
      email: adminUser.email,
      name: adminUser.name,
      role: adminRole.name,
      department: adminUser.department
    });
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const createTestUsers = async () => {
  try {
    const roles = await Role.find();
    const testUsers = [
      {
        name: 'Dr. John Smith',
        email: 'doctor@emr.com',
        password: 'doctor123',
        roleName: 'doctor',
        department: 'cardiology',
        employee_id: 'EMP002'
      },
      {
        name: 'Nurse Sarah Johnson',
        email: 'nurse@emr.com',
        password: 'nurse123',
        roleName: 'nurse',
        department: 'emergency',
        employee_id: 'EMP003'
      },
      {
        name: 'Receptionist Mike Wilson',
        email: 'receptionist@emr.com',
        password: 'receptionist123',
        roleName: 'receptionist',
        department: 'general',
        employee_id: 'EMP004'
      },
      {
        name: 'Billing Specialist Lisa Brown',
        email: 'billing@emr.com',
        password: 'billing123',
        roleName: 'billing_specialist',
        department: 'billing',
        employee_id: 'EMP005'
      },
      {
        name: 'Lab Tech David Chen',
        email: 'lab@emr.com',
        password: 'lab123',
        roleName: 'lab_technician',
        department: 'laboratory',
        employee_id: 'EMP006'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
        continue;
      }

      const role = roles.find(r => r.name === userData.roleName);
      if (!role) {
        console.log(`Role ${userData.roleName} not found`);
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: role._id,
        department: userData.department,
        employee_id: userData.employee_id,
        is_active: true
      });

      console.log(`Test user created: ${user.email} (${role.name})`);
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    
    console.log('Starting permission seeding...');
    await seedRoles();
    
    console.log('Creating default admin user...');
    await createDefaultAdmin();
    
    console.log('Creating test users...');
    await createTestUsers();
    
    console.log('Seeding completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@emr.com / admin123');
    console.log('Doctor: doctor@emr.com / doctor123');
    console.log('Nurse: nurse@emr.com / nurse123');
    console.log('Receptionist: receptionist@emr.com / receptionist123');
    console.log('Billing: billing@emr.com / billing123');
    console.log('Lab Tech: lab@emr.com / lab123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

main(); 