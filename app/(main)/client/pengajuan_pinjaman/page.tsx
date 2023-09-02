"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";

// import { Link } from 'react-router-dom'; 

interface UserData {
  id: number;
  nama: string;
  jenis_pinjaman: string;
  tanggal_pengajuan: string;
  tanggal_pencairan: string;
  email: string;
  created_by:string;
  approved_by: string;
  created_at: string;
  status: string;
  jumlah_pinjaman: string;
  bunga: string;
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
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};

// const [allExpanded, setAllExpanded] = useState(false);
const TableDemo = () => {
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token2 = localStorage.getItem('email');
    try {
      const response = await axios.get(`/api/user/history_pinjaman?email=${token2}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  function formatDate(dateString: string | number | Date) {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master User</h5>
        <a href={'/client/pengajuan_pinjaman/tambah'}  rel="noopener noreferrer" className="w-11rem mr-2">
      <Button
        // icon={allExpanded ? "pi pi-minus" : "pi pi-plus"}
        label={"Tambah Data"}
        className="w-11rem mb-3"
      />
      </a>
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
            <th className="border py-2 px-4">Nama</th>
              <th className="border py-2 px-4">Jenis Pinjaman</th>
              <th className="border py-2 px-4">Tanggal Pengajuan</th>
              <th className="border py-2 px-4">Tanggal Pencairan</th>
              <th className="border py-2 px-4">Jumlah Pinjaman</th>
              <th className="border py-2 px-4">Bunga</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Created By</th>
              <th className="border py-2 px-4">Aproved By</th>
              <th className="border py-2 px-4">Created At</th>
              <th className="border py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.nama}</td>
                <td className="border py-2 px-4">{item.jenis_pinjaman}</td>
                <td className="border py-2 px-4">{formatDate(item.tanggal_pengajuan)}</td>
                <td className="border py-2 px-4">{item.tanggal_pencairan ? formatDate(item.tanggal_pencairan) : 'null'}</td>
                <td className="border py-2 px-4">{item.jumlah_pinjaman}</td>
                <td className="border py-2 px-4">{item.bunga}</td>
                <td className="border py-2 px-4">{item.email}</td>
                <td className="border py-2 px-4">{item.created_by}</td>
                <td className="border py-2 px-4">{item.approved_by}</td>
                <td className="border py-2 px-4">{formatDate(item.created_at)}</td>
                <td className="border py-2 px-4">{item.status}</td>
                
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
