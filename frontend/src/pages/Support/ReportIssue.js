import React from 'react';
import SupportTicketForm from '../../components/User/SupportTicketForm';
import NavbarComponent from '../UserHome/NavbarComponent'; 
import Footer from '../../components/Footer/Footer';
import './reportIssue.css';

const ReportIssue = () => {
    return (
        <div className='support-home'>
            {/* Navbar */}
            <NavbarComponent />

            <div className='ticketContainer'>
                <SupportTicketForm />
            </div>

            <Footer/>
        </div>
    );
};

export default ReportIssue;