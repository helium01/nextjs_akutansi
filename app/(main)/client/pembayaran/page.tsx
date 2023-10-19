"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import  { useRouter } from "next/navigation";

// import { Link } from 'react-router-dom'; 

interface UserData {
  id: number;
  name:string;
  nip:string;
  acc_by:string;
  id_transaksi: string;
  angsuran_ke: string;
  jumlah_angsuran_bulan: string;
  sisa_angsuran: string;
  status: string;
  foto: string;
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
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};


// const [allExpanded, setAllExpanded] = useState(false);
const TableDemo = () => {
  const token = localStorage.getItem('email');
  const [data, setData] = useState<UserData[]>([]); // Menetapkan tipe UserData[]
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [id_transaksi, setTransaksi] = useState("");
  const [angsuran_ke, setAngsuran] = useState("");
  const [jumlah_angsuran_per_bulan, setAngsuran_bulan] = useState("");
  const [sisa_angsuran, setSisa] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [acc_by, setAcc_by] = useState('');
  const [image, setImage] = useState('');

  const handleEditClick = async (dataToEdit: { id:React.SetStateAction<string>; id_transaksi: React.SetStateAction<string>; angsuran_ke: React.SetStateAction<string>; 
    jumlah_angsuran_bulan: React.SetStateAction<string>; sisa_angsuran: React.SetStateAction<string>; 
    status: React.SetStateAction<string>; name: React.SetStateAction<string>; nip: React.SetStateAction<string>; acc_by: React.SetStateAction<string>; 
  }) => {
   
    const token2 = localStorage.getItem('role');
    console.log(dataToEdit.id);
    console.log(formattedDateTime);
    const formData = {
      id:dataToEdit.id,
      name:dataToEdit.name,
      nip:dataToEdit.nip,
      acc_by:dataToEdit.acc_by,
      id_transaksi:dataToEdit.id_transaksi,
      angsuran_ke:dataToEdit.angsuran_ke,
      jumlah_angsuran_per_bulan:dataToEdit.jumlah_angsuran_bulan,
      sisa_angsuran:dataToEdit.sisa_angsuran,
      status:dataToEdit.status,
      foto:"null",
      created_at: formattedDateTime, 
      created_by:token2,
    };

    try {
      const response = await fetch('/api/user/tambah_pembayaran', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrasi berhasil, lakukan tindakan yang sesuai
        console.log('Registration successful');
        setIsEditing(false);
        fetchData(); // Pindahkan ke halaman login
      } else {
        // Registrasi gagal, lakukan tindakan yang sesuai
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const formattedDateTime = formatDateTime(currentDateTime);
  const handleSave = async () => {
   
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/user/pembayaran?email=${token}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImage(e.target.result);
  //       setName(file.name);

  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append('image', image);
  //   formData.append('name', name);

  //   const response = await fetch('/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   if (response.ok) {
  //     console.log('Upload berhasil.');
  //   } else {
  //     console.error('Upload gagal.');
  //   }
  // };

  return (
    <div className="p-grid p-dir-col">
       {isEditing ? (
    // Tampilkan formulir edit jika sedang dalam mode pengeditan
    <div className="grid p-fluid">
      <div className="col-12 md:col-4">
        <div className="card">
          <h5>Tambahkan Data</h5>

          <div>
         
          <input
          type="file"
          accept="image/*"
          // onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
              <Button
                label="Simpan"
                className="w-full p-3 text-xl"
                // onClick={handleSubmit}
              ></Button>
            </div>
        </div>

        
      </div>
    </div>
  ) : (
    <div className="p-col-12">
      <div className="card p-4">
        <h5 className="text-xl font-semibold mb-4">Master Pembayaran</h5>
        
       <table className="min-w-full border-collapse table-auto col">
          <thead>
            <tr className="bg-gray-100">
              <th className="border py-2 px-4">Id Transaksi</th>
              <th className="border py-2 px-4">Name</th>
              <th className="border py-2 px-4">Nip</th>
              <th className="border py-2 px-4">Angsuran Ke</th>
              <th className="border py-2 px-4">Jumlah Angsuran Per Bulan</th>
              <th className="border py-2 px-4">Sisa Angsuran</th>
              <th className="border py-2 px-4">Status</th>
              <th className="border py-2 px-4">Acc_by</th>
              {/* <th className="border py-2 px-4">Foto</th> */}
              <th className="border py-2 px-4">Created At</th>
              <th className="border py-2 px-4">Opsi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border py-2 px-4">{item.id_transaksi}</td>
                <td className="border py-2 px-4">{item.name}</td>
                <td className="border py-2 px-4">{item.nip}</td>
                <td className="border py-2 px-4">{item.angsuran_ke}</td>
                <td className="border py-2 px-4">{item.jumlah_angsuran_bulan}</td>
                <td className="border py-2 px-4">{item.sisa_angsuran}</td>
                <td className="border py-2 px-4">{item.status}</td>
                <td className="border py-2 px-4">{item.acc_by}</td>
                {/* <td className="border py-2 px-4">{item.foto}</td> */}
                <td className="border py-2 px-4">{item.created_at}</td>
                <td className="border py-2 px-4">
                <button 
                  onClick={() => handleEditClick(item)}
                  className={`${
                    item.status !== 'Sudah DIbayar' && item.status !== 'Pending' ? 'bg-green-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300' : 'hidden'
                  }`}
               >
                 Bayar
          </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
    
  </div>
  );
};

export default withAuth(TableDemo);
