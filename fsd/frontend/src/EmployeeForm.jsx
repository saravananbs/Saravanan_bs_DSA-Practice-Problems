import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeForm.css';

const EmployeeForm = () => {
    //console.log('hello')
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        email: '',
        phone_number: '',
        department: '',
        date_of_joining: '',
        role: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const validate = () => {
        const errors = {};
        const today = new Date().toISOString().split('T')[0];
        if (!formData.employee_id) errors.employee_id = 'Employee ID is required.';
        if (!formData.name) errors.name = 'Name is required.';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
            errors.email = 'A valid email is required.';
        if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number))
            errors.phone_number = 'Phone number must be 10 digits.';
        if (!formData.department) errors.department = 'Department is required.';
        if (!formData.date_of_joining) {
            errors.date_of_joining = 'Date of joining is required.';
        } else if (formData.date_of_joining > today) {
            errors.date_of_joining = 'Date of joining cannot be in the future.';
        }
        if (!formData.role) errors.role = 'Role is required.';
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:5000/api/employees', formData);
                //console.log(response.data)
                setMessage(response.data);
                setFormData({
                    employee_id: '',
                    name: '',
                    email: '',
                    phone_number: '',
                    department: '',
                    date_of_joining: '',
                    role: '',
                });
            } catch (error) {
                setMessage(error.response?.data || 'Submission failed.');
            }
        }
    };

    return (
        <div>
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <input name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleChange} />
                <p>{errors.employee_id}</p>

                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <p>{errors.name}</p>

                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <p>{errors.email}</p>

                <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                <p>{errors.phone_number}</p>

                <select name="department" value={formData.department} onChange={handleChange}>
                    <option value="">select Department</option>
                    <option value="manager">manager</option>
                    <option value="research">research</option>
                    <option value="sales">sales</option>
                </select>
                <p>{errors.department}</p>

                <input type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} />
                <p>{errors.date_of_joining}</p>

                <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
                <p>{errors.role}</p>

                <button type="submit">Submit</button>
                <button type="reset" onClick={() => setFormData({
                    employee_id: '',
                    name: '',
                    email: '',
                    phone_number: '',
                    department: '',
                    date_of_joining: '',
                    role: '',
                })}>Reset</button>
            </form>
            <p name="last-result">{message}</p>
        </div>
    );
};

export default EmployeeForm;
