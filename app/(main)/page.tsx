/* eslint-disable @next/next/no-img-element */
"use client";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import  { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';

interface DashboardData {
  pengajuan: number;
  user: number;
  pemasukan: number | null;
  pinjaman: number;
  simpanan_pokok:number |null;
  simpanan_wajib:number |null;
  simpanan_sukarela:number |null;
  total_pinjaman:number |null;
}

const withAuth = (WrappedComponent: React.ComponentType) => {
  // const router = useRouter();
  return (props: any) => {
    // Memeriksa apakah ada token dalam local storage
    const router = useRouter();
    

    useEffect(() => {
      const token = localStorage.getItem('token');
      const token2 = localStorage.getItem('email');
      const token3 = localStorage.getItem('status');
      console.log("token"+token3);
      if (!token) {
        router.replace('/auth/login'); // Ganti dengan halaman login
      }
    }, []);

    // Jika token ada, render komponen halaman terproteksi
    return <WrappedComponent {...props} />;
  };
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({ pengajuan: 0,
    user: 0,
    pemasukan: null,
    pinjaman: 0,
    simpanan_pokok:null,
    simpanan_sukarela:0,
    simpanan_wajib:0,
    total_pinjaman:0,
  }); 
  useEffect(() => {
    axios.get('/api/dashboard?email=${token2}') 
      .then(response => {
        console.log(response.data);
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });  
  }, []);
  const token = localStorage.getItem('role');
  const token3 = localStorage.getItem('status');
  if(token3=="inactive"){
    return( 
      <div className="grid">
      <div className="col-12">
        <div className="card bg-red-500">
        <h5 className="text-white">Inactive</h5>
      <p className="text-white">
        status anda sedang in active tolong hubungi admin untuk mengaktifkanya
      </p>
        </div>
      </div>
    </div>
    );
   
  }else{
    if(token=="Admin"){
      return (
        <div className="grid">
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Jumlah User</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.pengajuan}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Pengajuan Pinjaman</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.user}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-orange-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-map-marker text-orange-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Pemasukan Koperasi</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.pemasukan}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-inbox text-cyan-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Total Pinjaman</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.pinjaman}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-purple-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-comment text-purple-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      );
    }else{
      return (
        <div className="grid">
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Total Tabungan Pokok</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.simpanan_pokok}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Total Tabungan Wajib</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.simpanan_wajib}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-orange-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-map-marker text-orange-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Total Tabungan Sukarela</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.simpanan_sukarela}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-inbox text-cyan-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Total Pinjaman</span>
                  <div className="text-900 font-medium text-xl">{dashboardData.total_pinjaman}</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-purple-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-comment text-purple-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
    
          
    
          
        </div>
      );
    }
  }
  
  
};

export default withAuth(Dashboard);
