import prisma from '../constants/config';
import bcrypt from 'bcrypt';

export const user_update_profile = async (req: any, res: any) => {
  const { firstName, lastName } = req.body;
  //if the user is logged in

  if (req.session.userId) {
    try {
      await prisma.user.update({
        where: {
          id: req.session.userId,
        },
        data: {
          firstName,
          lastName,
        },
      });
      res.status(200).send('updated');
    } catch (err) {
      console.log(err);
      res.status(500).send('Error updating data');
    }
  } else {
    res.status(401).send('You must be logged in to do tha t');
  }
};

export const user_update_password = async (req: any, res: any) => {
  const { password, oldPassword } = req.body;

  let user;
  if (req.session.userId) {
    try {
      user = await prisma.user.findUnique({
        where: {
          id: req.session.userId,
        },
      });
    } catch {
      res.status(500).send('error updating password');
      return;
    }
  } else {
    res.status(401).send('You must be login to do that');
  }

  // if the user is found
  if (user) {
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (isPasswordCorrect) {
      //hash and salt new pw
      const saltRounds = 10;
      let newPassword = await bcrypt.hash(password, saltRounds);
      try {
        await prisma.user.update({
          where: {
            id: req.session.userId,
          },
          data: {
            password: newPassword,
          },
        });
      } catch {
        res.status(500).send('Cannot update the password');
      }
    } else {
      //IF PW IS NOT CORRECT
      res.status(403).send('wrong password');
    }
  }
};

export const user_delete = async (req: any, res: any) => {
  const userId = req.session.userId;
  req.session.destroy((err: Error) => {
    if (err) res.status(500).send('Cannot destroy session');
    else res.status(200).send('Deleted');
  });
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
