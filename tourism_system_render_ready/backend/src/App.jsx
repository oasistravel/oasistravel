import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import AddReservation from './pages/AddReservation';
import InvoiceReport from './pages/InvoiceReport';
import Companies from './pages/Companies';
import CompanyReport from './pages/CompanyReport';
import HR from './pages/HR';
import HiaceChart from './pages/HiaceChart';
import RoomChart from './pages/RoomChart';
import Customers from './pages/Customers';
import FinanceReport from './pages/FinanceReport';
import MonthlyReport from './pages/MonthlyReport';
import AddExpense from './pages/AddExpense';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-reservation" element={<AddReservation />} />
          <Route path="invoice-report" element={<InvoiceReport />} />
          <Route path="companies" element={<Companies />} />
          <Route path="company-report" element={<CompanyReport />} />
          <Route path="hr" element={<HR />} />
          <Route path="hiace-chart" element={<HiaceChart />} />
          <Route path="room-chart" element={<RoomChart />} />
          <Route path="customers" element={<Customers />} />
          <Route path="finance-report" element={<FinanceReport />} />
          <Route path="monthly-report" element={<MonthlyReport />} />
          <Route path="add-expense" element={<AddExpense />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}