import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    let db;
    try {
      // Konfigurasi koneksi database
      db = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'akutansi2',
      });

      const [rows] = await db.query('SELECT * FROM users');
      const [rows2] = await db.query( `
      SELECT users.*, transaksi_simpanans.*, totals.total_simpanan
      FROM users
      INNER JOIN transaksi_simpanans ON users.email = transaksi_simpanans.email
      LEFT JOIN (
          SELECT email, SUM(besar_simpanan) as total_simpanan
          FROM transaksi_simpanans
          GROUP BY email
      ) AS totals ON users.email = totals.email
    `);
    //   console.log(rows);
      res.status(200).json({rows,rows2});
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error });
    } finally {
      if (db) {
        // Pastikan db memiliki nilai sebelum mencoba memanggil .end()
        db.end(); // Menutup koneksi pool saat selesai
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
