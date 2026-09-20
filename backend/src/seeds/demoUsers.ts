import User from '../models/User';
import AuthService from '../services/authService';

export const seedDemoUsers = async () => {
  try {
    const existingUser = await User.findOne({ where: { email: 'director@trc.com' } });
    if (existingUser) {
      console.log('Demo users already exist');
      return;
    }

    const users = [
      {
        email: 'director@trc.com',
        password: 'Password123!',
        firstName: 'Sajesh',
        lastName: 'Paul',
        role: 'director' as const,
      },
      {
        email: 'manager@trc.com',
        password: 'Password123!',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'manager' as const,
      },
      {
        email: 'staff@trc.com',
        password: 'Password123!',
        firstName: 'Mike',
        lastName: 'Chen',
        role: 'staff' as const,
      },
    ];

    for (const userData of users) {
      const passwordHash = await AuthService.hashPassword(userData.password);
      await User.create(
        {
          email: userData.email,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          status: 'active',
        } as any
      );
      console.log(`✓ Created ${userData.role} user: ${userData.email}`);
    }
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
};
