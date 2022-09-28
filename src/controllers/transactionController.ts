import prisma from '../constants/config';
import { DateTime } from 'luxon';

export const transaction_post = async (req: any, res: any) => {
  const { title, money, date, info, transactionCategoryId } = req.body;

  if (req.session.userId) {
    const wallet = await prisma.wallet
      .findUnique({
        where: {
          userId: req.session.userId,
        },
      })
      .catch();

    try {
      await prisma.transaction.create({
        data: {
          title,
          money: parseFloat(money),
          date: DateTime.fromISO(date).toJSDate(),
          info,
          transactionCategoryId: transactionCategoryId,
          userId: req.session.userId,
        },
      });
      res.status(200).send('Transaction added');
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Something went wrong' });
    }
  }
};

export const transactions_get = async (req: any, res: any) => {
  let { firstDate, lastDate, category, dateSort, priceSort, take, skip } =
    req.query;

  if (!Number(skip)) {
    skip = 0;
  }
  if (!Number(take)) {
    take = 5;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.session.userId,
        date: {
          gte:
            firstDate != undefined
              ? DateTime.fromISO(firstDate).toISO()
              : DateTime.now().minus({ days: 30 }).toISO(),
          lt:
            lastDate != undefined
              ? DateTime.fromISO(lastDate).toISO()
              : DateTime.now().toISO(),
        },
        transactionCategoryId: category,
      },
      skip: parseInt(skip),
      take: parseInt(take) + 1,

      orderBy: {
        date: dateSort ?? undefined,
        money: priceSort ?? undefined,
      },

      select: {
        title: true,
        money: true,
        date: true,
        info: true,
        id: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      transactions:
        transactions?.length > take ? transactions.slice(0, -1) : transactions,
      hasMore: transactions.length > take ? true : false,
    });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const transaction_delete = async (req: any, res: any) => {
  const transactionId = req.params.transactionId;
  let tr;
  try {
    tr = await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId: req.session.userId,
      },
    });

    res.status(200).send('success');
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
