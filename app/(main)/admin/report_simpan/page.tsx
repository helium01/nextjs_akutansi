"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";
import pdfMake from 'pdfmake/build/pdfmake';
import { StyleDictionary } from "pdfmake/interfaces";
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Link } from 'react-router-dom'; 
const fontURL = '/Roboto-Medium.ttf';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs[fontURL] = fetch('/Roboto-Medium.ttf').then(response => response.arrayBuffer());
// Tambahkan definisi font
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Medium.ttf', // Sesuaikan dengan path yang benar
    bold: 'Roboto-Medium.ttf',   // Juga sesuaikan dengan path yang benar
  },
};
interface UserData {
  id: number;
  nama: string;
  jenis_simpan: string;
  deskripsi: string;
  besar_simpanan: string;
  email: string;
  created_by: string;
  created_at: string;
}
const withAuth = (WrappedComponent: React.ComponentType) => {
  // const router = useRouter();
  return (props: any) => {
    // Memeriksa apakah ada token dalam local storage
    const router = useRouter();
    

    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('role');
      console.log("token"+token);
      if (!token) {
        router.replace('/auth/login'); // Ganti dengan halaman login
      }
      if(token2=="User"){
        router.replace('/client/history_simpan');
      }
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};
function formatDate(dateString: string | number | Date) {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// const [allExpanded, setAllExpanded] = useState(false);
const TableDemo = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/view_data?nama_tabel=transaksi_simpanans');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchAndGeneratePDF = async () => {
    try {
      // Fetch data from the API
      await fetchData();

      // Define the PDF document content using the fetched data
      const documentDefinition = {
        pageSize: 'A3', 
        content: [
          {
            text: 'Laporan User',
            style: 'header',
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*','*','*', '*','*','*'],
              body: [
                  ['Nama','Jenis Simpan','Deskripsi','Besar','Email','Created by', 'Created At'], // Table header
                ...data.map(item => [item.nama,item.jenis_simpan,item.deskripsi,item.besar_simpanan,item.email,item.created_by, item.created_at]), // Table data
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 12,
            font: 'Roboto',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
        } as StyleDictionary,
        pageOrientation: 'landscape',  // Add "as StyleDictionary" here
      };
      
      

      // Create the PDF
      const pdfDoc = pdfMake.createPdf(documentDefinition);

      // Download the PDF
      pdfDoc.download('laporan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  

  return (
    <div className="p-grid p-dir-col">
    
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master User</h5>
        <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Cetak Data"}
        className="w-11rem mb-3"
        onClick={fetchAndGeneratePDF}
      />
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Nama</th>
              <th className="border py-2 px-4">Jenis Simpanan</th>
              <th className="border py-2 px-4">Deskripsi</th>
              <th className="border py-2 px-4">Besar Simpanan</th>
              <th className="border py-2 px-4">email</th>
              <th className="border py-2 px-4">Created By</th>
              <th className="border py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.nama}</td>
                <td className="border py-2 px-4">{item.jenis_simpan}</td>
                <td className="border py-2 px-4">{item.deskripsi}</td>
                <td className="border py-2 px-4">{item.besar_simpanan}</td>
                <td className="border py-2 px-4">{item.email}</td>
                <td className="border py-2 px-4">{item.created_by}</td>
                <td className="border py-2 px-4">{formatDate(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
   
  );
};

export default withAuth(TableDemo);
