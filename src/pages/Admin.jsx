import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import AdminLogin from './AdminLogin';
import styles from '../styles/Admin.module.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTicketType, setFilterTicketType] = useState('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchRegistrations();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, 'registrations'), orderBy('registeredAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const registrationsData = [];
      querySnapshot.forEach((doc) => {
        registrationsData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setRegistrations(registrationsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations. Please check your permissions.');
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTicketType = (type) => {
    const types = {
      'general-admission': 'General Admission',
      'vip-experience': 'VIP Experience Single',
      'family-package': 'Family Package'
    };
    return types[type] || type;
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterTicketType === 'all' || reg.ticketType === filterTicketType;

    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Ticket Type', 'Adults', 'Children', 'Special Needs', 'Registered At', 'Status'];
    const csvData = filteredRegistrations.map(reg => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone || '',
      formatTicketType(reg.ticketType),
      reg.adults,
      reg.children,
      reg.specialNeeds || '',
      formatDate(reg.registeredAt),
      reg.status || 'confirmed'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const totalAttendees = filteredRegistrations.reduce((sum, reg) => {
    return sum + (parseInt(reg.adults) || 0) + (parseInt(reg.children) || 0);
  }, 0);

  if (authLoading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={() => setUser(auth.currentUser)} />;
  }

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loading}>Loading registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div>
          <h1>Event Registration Admin</h1>
          <p className={styles.userEmail}>Logged in as: {user.email}</p>
        </div>
        <div className={styles.headerButtons}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
          <button onClick={() => window.location.href = '/'} className={styles.backButton}>
            Back to Main Site
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Registrations</h3>
          <p className={styles.statNumber}>{filteredRegistrations.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Attendees</h3>
          <p className={styles.statNumber}>{totalAttendees}</p>
        </div>
        <div className={styles.statCard}>
          <h3>General Admission</h3>
          <p className={styles.statNumber}>
            {registrations.filter(r => r.ticketType === 'general-admission').length}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>VIP Tickets</h3>
          <p className={styles.statNumber}>
            {registrations.filter(r => r.ticketType === 'vip-experience').length}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filterTicketType}
          onChange={(e) => setFilterTicketType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Ticket Types</option>
          <option value="general-admission">General Admission</option>
          <option value="vip-experience">VIP Experience</option>
          <option value="family-package">Family Package</option>
        </select>
        <button onClick={exportToCSV} className={styles.exportButton}>
          Export to CSV
        </button>
        <button onClick={fetchRegistrations} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.registrationsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Ticket Type</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Special Needs</th>
              <th>Registered At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>No registrations found</td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.firstName} {reg.lastName}</td>
                  <td>{reg.email}</td>
                  <td>{reg.phone || 'N/A'}</td>
                  <td>{formatTicketType(reg.ticketType)}</td>
                  <td>{reg.adults}</td>
                  <td>{reg.children}</td>
                  <td className={styles.specialNeeds}>
                    {reg.specialNeeds || 'None'}
                  </td>
                  <td>{formatDate(reg.registeredAt)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[reg.status || 'confirmed']}`}>
                      {reg.status || 'confirmed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
