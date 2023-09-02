import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Konfigurasi koneksi ke database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akutansi2',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') { // Anda dapat menggunakan PUT atau PATCH sesuai preferensi Anda
    try {
      const { id,id_transaksi, angsuran_ke,jumlah_angsuran_per_bulan, sisa_angsuran,status,foto,created_at} = req.body;
      console.log(req.body);
      // Membuka koneksi ke database
      let status2;
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk mengedit data dalam tabel berdasarkan ID
      const query = `
        UPDATE pembayaran
        SET status = ?
        WHERE id = ?
      `; 
      await connection.execute(query, ["Sudah DIbayar", id]);

      // Menutup koneksi database
       
            console.log(angsuran_ke-1);
            if(angsuran_ke-1==0){
                status2="Lunas";
               }else{
                status2="Belum Lunas";
               }
        const query3 = `
        INSERT INTO pembayaran (id_transaksi, angsuran_ke,jumlah_angsuran_bulan,sisa_angsuran,status,foto, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
    //   console.log(id, id_transaksi, angsuran_ke-1, jumlah_angsuran_per_bulan, sisa_angsuran-jumlah_angsuran_per_bulan, status2,tanggal_pencairan);
      await connection.execute(query3, [id_transaksi, angsuran_ke-1, jumlah_angsuran_per_bulan, sisa_angsuran-jumlah_angsuran_per_bulan, status2,foto,created_at]);
// console.log(connection.execute(query3, [id, lamaAngsuran, hasil, lamaAngsuran, status, "null",tanggal_pencairan]));
          // Menutup koneksi database
          connection.end();
    
      res.status(200).json({ message: "sukses" });
    } catch (error) {
      res.status(500).json({ message: 'Error editing data', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
