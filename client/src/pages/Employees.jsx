import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Loader2 } from 'lucide-react'
import { dummyEmployeeData, DEPARTMENTS } from '../assets/assets'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeForm from '../components/EmployeeForm'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedDept, setSelectedDept] = useState("")
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setEmployees(dummyEmployeeData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [selectedDept])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filteredEmployees = employees
    .filter((emp) => emp.firstName.toLowerCase().includes(search.toLowerCase()))
    .filter((emp) => !selectedDept || emp.department === selectedDept)

  const handleOpenCreateModal = () => {
    setEditEmployee(null)
    setShowCreateModal(true)
  }

  const handleOpenEditModal = (emp) => {
    setEditEmployee(emp)
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditEmployee(null)
  }

  const handleSaveEmployee = (data) => {
    if (editEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editEmployee.id ? { ...emp, ...data } : emp))
      )
    } else {
      const newEmployee = {
        ...data,
        id: `emp_${Date.now()}`,
        _id: `emp_${Date.now()}`,
        employmentStatus: 'ACTIVE',
        isDeleted: false,
      }
      setEmployees((prev) => [...prev, newEmployee])
    }
    handleCloseModal()
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8">
      {/* header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Employees</h1>
          <p className='page-subtitle'>Manage your team members</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* searchbar */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className='relative w-full sm:flex-1'>
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            placeholder="Search Employees..."
            className='w-full pl-10'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-48 shrink-0"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((deptName) => (
            <option key={deptName} value={deptName}>
              {deptName}
            </option>
          ))}
        </select>
      </div>

      {/* Employees cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onDelete={fetchEmployees}
              onEdit={() => handleOpenEditModal(emp)}
            />
          ))}
          {filteredEmployees.length === 0 && <p>No employees found</p>}
        </div>
      )}

      {showCreateModal && (
        <EmployeeForm
          employee={editEmployee}
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  )
}

export default Employees