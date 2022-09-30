import prisma from '../constants/config';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export const auth_login = async (req: any, res: any) => {
  let user: User | null;
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Fields Missing' });
    return;
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordCorrect = await bcrypt.compare(password, user!.password);

    if (isPasswordCorrect) {
      req.session.userId = user?.id;
      res.status(200).send('Authenticated');
    }
  } catch {
    res.status(401).json('Invalid credentials');
    return;
  }
};

export const auth_register = async (req: any, res: any) => {
  const { email } = req.body;
  const { password } = req.body;
  const { firstName = '' } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Fields Missing' });
    return;
  }

  let emailCheck;
  try {
    emailCheck = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch {
    res
      .status(400)
      .send([{ instancePath: 'Email Availability', message: 'Error' }]);
  }

  if (emailCheck) {
    res
      .status(400)
      .send([{ instancePath: 'Email', message: 'Email is already taken' }]);
  } else {
    const saltRounds = 10;
    let salted_password = await bcrypt.hash(password, saltRounds);
    let newUser;

    try {
      newUser = await prisma.user.create({
        data: {
          email: email,
          password: salted_password,
          firstName,
          lastName: '',
        },
      });
    } catch {
      res.status(500).send([{ instancePath: 'Err', message: 'Err' }]);
      return;
    }

    try {
      await prisma.wallet.create({
        data: {
          userId: newUser?.id,
        },
      });
      res.status(200).send('new user created');
    } catch {
      res.status(400).send('error creating user');
    }
  }
};

export const auth_logout = async (req: any, res: any) => {
  req.session.destroy((err: Error) => {
    if (err) res.status(500).send('Cannot destroy session');
    else res.status(200).send('Session destroyed');
  });
};

export const auth_user = async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) res.status(401).json('User Not Found');
    const data = {
      email: user?.email,
      userId: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
    res.status(200).json(data);
  } catch {
    res.status(500).json('Something Went Wrong {auth}');
  }
};
