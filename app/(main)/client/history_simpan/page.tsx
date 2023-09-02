"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";

// import { Link } from 'react-router-dom'; 

interface UserData {
  id: number;
  nama: string;
  jenis_simpan: string;
  deskripsi: string;
  besar_simpanan: string;
  created_by: string;
  created_at: string;
  email: string;
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
  const [nilai, setNilai] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
 

  const fetchData = async () => {
    const token2 = localStorage.getItem('email');
    try {
      const response = await axios.get(`/api/user/history_simpan?email=${token2}`);
      console.log(response.data);
      setNilai(response.data.rows2[0].total_simpanan);
      setData(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  return (
    <div className="p-grid p-dir-col">
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master User</h5>
        <h5 className="text-xl font-semibold mb-4">Total Simpanan:{nilai}</h5>
        
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Nama</th>
              <th className="border py-2 px-4">Jenis Simpanan</th>
              <th className="border py-2 px-4">Deskripsi</th>
              <th className="border py-2 px-4">Besar Simpanan</th>
              <th className="border py-2 px-4">Created By</th>
              <th className="border py-2 px-4">Created At</th>
              <th className="border py-2 px-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.nama}</td>
                <td className="border py-2 px-4">{item.jenis_simpan}</td>
                <td className="border py-2 px-4">{item.deskripsi}</td>
                <td className="border py-2 px-4">{item.besar_simpanan}</td>
                <td className="border py-2 px-4">{item.created_by}</td>
                <td className="border py-2 px-4">{item.created_at}</td>
                <td className="border py-2 px-4">{item.email}</td>
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
