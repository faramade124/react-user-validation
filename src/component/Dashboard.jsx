"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Users,
  Monitor,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

const customerData = [
  {
    name: "Jane Cooper",
    company: "Microsoft",
    phone: "(225) 555-0118",
    email: "jane@microsoft.com",
    country: "United States",
    status: "Active",
  },
  {
    name: "Floyd Miles",
    company: "Yahoo",
    phone: "(205) 555-0100",
    email: "floyd@yahoo.com",
    country: "Kiribati",
    status: "Inactive",
  },
  {
    name: "Ronald Richards",
    company: "Adobe",
    phone: "(302) 555-0107",
    email: "ronald@adobe.com",
    country: "Israel",
    status: "Inactive",
  },
  {
    name: "Marvin McKinney",
    company: "Tesla",
    phone: "(252) 555-0126",
    email: "marvin@tesla.com",
    country: "Iran",
    status: "Active",
  },
  {
    name: "Jerome Bell",
    company: "Google",
    phone: "(629) 555-0129",
    email: "jerome@google.com",
    country: "Réunion",
    status: "Active",
  },
  {
    name: "Kathryn Murphy",
    company: "Microsoft",
    phone: "(406) 555-0120",
    email: "kathryn@microsoft.com",
    country: "Curaçao",
    status: "Active",
  },
  {
    name: "Jacob Jones",
    company: "Yahoo",
    phone: "(208) 555-0112",
    email: "jacob@yahoo.com",
    country: "Brazil",
    status: "Active",
  },
  {
    name: "Kristin Watson",
    company: "Facebook",
    phone: "(704) 555-0127",
    email: "kristin@facebook.com",
    country: "Åland Islands",
    status: "Inactive",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("customers")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("Newest")
  const [userDisplayName, setUserDisplayName] = useState("User")

  const { logout, currentUser, userProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Set user display name from profile or auth
    if (userProfile?.fullName) {
      setUserDisplayName(userProfile.fullName.split(" ")[0]) // First name only
    } else if (currentUser?.displayName) {
      setUserDisplayName(currentUser.displayName.split(" ")[0])
    } else if (currentUser?.email) {
      setUserDisplayName(currentUser.email.split("@")[0])
    }
  }, [currentUser, userProfile])

  async function handleLogout() {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", active: false },
    { id: "product", label: "Product", icon: "📦", active: false, hasSubmenu: true },
    { id: "customers", label: "Customers", icon: "👥", active: true },
    { id: "income", label: "Income", icon: "💰", active: false, hasSubmenu: true },
    { id: "promote", label: "Promote", icon: "📢", active: false, hasSubmenu: true },
    { id: "help", label: "Help", icon: "❓", active: false, hasSubmenu: true },
  ]

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚙️</span>
            <span className="logo-text">Dashboard</span>
            <span className="version">v.01</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <div key={item.id} className={`nav-item ${item.active ? "active" : ""}`}>
              <div className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.hasSubmenu && <ChevronRight size={16} className="nav-arrow" />}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="upgrade-card">
            <h4>Upgrade to PRO to get access all Features!</h4>
            <button className="upgrade-btn">Get Pro Now!</button>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              <img src="/public/images/portrait-young-handsome-man.png" alt="User" />
            </div>
            <div className="user-info">
              <div className="user-name">{userDisplayName}</div>
              <div className="user-role">Project Manager</div>
            </div>
            <button onClick={handleLogout} className="user-menu" title="Logout">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Hello {userDisplayName} 👋,</h1>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon customers">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Customers</div>
              <div className="stat-value">5,423</div>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                16% this month
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon members">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Members</div>
              <div className="stat-value">1,893</div>
              <div className="stat-change negative">
                <TrendingDown size={16} />
                1% this month
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">
              <Monitor size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Active Now</div>
              <div className="stat-value">189</div>
              <div className="stat-avatars">
                <div className="avatar-stack">
                  <img src="/public/images/portrait-young-handsome-man.png" alt="User 1" />
                  <img src="/public/images/portrait-young-handsome-man.png" alt="User 2" />
                  <img src="/public/images/portrait-young-handsome-man.png" alt="User 3" />
                  <img src="/public/images/portrait-young-handsome-man.png" alt="User 4" />
                  <img src="/public/images/portrait-young-handsome-man.png" alt="User 5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="customers-section">
          <div className="section-header">
            <div className="section-title">
              <h2>All Customers</h2>
              <span className="active-members">Active Members</span>
            </div>
            <div className="section-controls">
              <div className="search-box small">
                <Search size={16} />
                <input type="text" placeholder="Search" />
              </div>
              <div className="sort-dropdown">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Name">Name</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="customers-table">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Company</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name}</td>
                    <td>{customer.company}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.country}</td>
                    <td>
                      <span className={`status ${customer.status.toLowerCase()}`}>{customer.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="showing-info">Showing data 1 to 8 of 256K entries</div>
            <div className="pagination">
              <button className="page-btn">{"<"}</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <span>...</span>
              <button className="page-btn">40</button>
              <button className="page-btn">{">"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
