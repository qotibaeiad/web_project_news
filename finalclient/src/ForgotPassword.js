import React, { useState } from 'react';
import { ipAddress } from './App';


function ForgotPassword() {
    // State variables to manage form inputs and email existence    
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailExists, setEmailExists] = useState(false); // State to track if email exists

    // Function to handle changes in the email input field
    const handleEmailChange = async (event) => {
        // Get the current value of the email input
        const emailValue = email;
        if (emailValue === '') {
            alert('Please enter your email');
            return;
        }
        // Send a request to your backend API to check if the email exists
        try {
            const response = await fetch(`${ipAddress}/api/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailValue })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            // Update the state based on the response from the server
            if(data){
            setEmailExists(data);}
            else{
                alert('user not exsist')
            }
          
        } catch (error) {
            console.error('Error checking email:', error);
            // Handle error (e.g., show an error message)
        }
    
        setEmail(emailValue);
    };
    
    // Function to handle changes in the email input field
    const emailchange= (event) => {
        setEmail(event.target.value);
    }

    // Function to handle changes in the new password input field
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    // Function to handle changes in the confirm password input field
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (email === '') {
            alert('Please enter your email');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch(`${ipAddress}/api/updateUserPasword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            // Redirect to the login page if password update is successful
            if(data.success){
                window.location.href = '/login';
            }
            else{
                alert("try another password");
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen" style={{
            backgroundImage: `url('https://www.hindustantimes.com/ht-img/img/2023/07/17/550x309/WhatsApp_Image_2021-09-18_at_09.42.18_1631944439782_1689553460678.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="flex justify-center items-center h-screen">
                <div className="w-96 p-6 shadow-lg bg-white rounded-md dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <h1 className="text-3xl block text-center font-semibold text-black dark:text-white"><i className="fa-solid fa-user text-black dark:text-white"></i> Forgot Password</h1>
                    <hr className="mt-3" />
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-col w-3/4">
                            <label htmlFor="email" className="block text-base mb-2 text-black dark:text-white">Email</label>
                            <input type="email" id="email" className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 dark:text-gray-400" placeholder="Enter Email..." value={email} onChange={emailchange} />
                        </div>
                        <div className="w-1/4 ml-2 mt-8">
                            <button type="button" onClick={handleEmailChange} className="border-2 border-bg-gray-800 bg-gray-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-800 font-semibold dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700">Check</button>
                        </div>
                    </div>
                    {/* If email exists password fields will open and the user can see them and update their password */}
                    {emailExists && (
                        <div>
                            <div className="mt-3">
                                <label htmlFor="newPassword" className="block text-base mb-2 text-black dark:text-white">New Password</label>
                                <input type="password" id="newPassword" className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 dark:text-gray-400" placeholder="Enter New Password..." value={newPassword} onChange={handleNewPasswordChange} />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="confirmPassword" className="block text-base mb-2 text-black dark:text-white">Confirm Password</label>
                                <input type="password" id="confirmPassword" className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 dark:text-gray-400" placeholder="Confirm New Password..." value={confirmPassword} onChange={handleConfirmPasswordChange} />
                            </div>
                        </div>
                    )}
                    <div className="mt-5">
                        <button type="button" onClick={handleSubmit} className="border-2 border-bg-gray-800 bg-gray-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-800 font-semibold dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"><i className="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
