import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Oasis Travel</h3>
        <nav>
          <Link to="/">🏠 لوحة التحكم</Link>
          <Link to="/add-reservation">➕ إضافة حجز</Link>
          <Link to="/invoice-report">📋 تقرير الفواتير</Link>
          <Link to="/companies">🏢 إدارة الشركات</Link>
          <Link to="/company-report">📊 تقرير الشركات</Link>
          <Link to="/hr">🧑‍💼 HR</Link>
          <Link to="/hiace-chart">🚌 شارت هاي اس</Link>
          <Link to="/room-chart">🏨 شارت الغرف</Link>
          <Link to="/customers">👥 العملاء</Link>
          <Link to="/finance-report">📆 تقرير يومي</Link>
          <Link to="/monthly-report">📅 تقرير شهري</Link>
          <Link to="/add-expense">💵 إضافة مصروف</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}