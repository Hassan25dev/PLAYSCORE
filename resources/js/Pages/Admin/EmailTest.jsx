import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function EmailTest({ auth, users, currentUser }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: currentUser.email,
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.email-test.send'), {
            onSuccess: () => {
                setSuccessMessage('Test email sent successfully!');
                setTimeout(() => setSuccessMessage(''), 5000);
            },
            onError: (errors) => {
                setErrorMessage('Failed to send email. Please check the form and try again.');
                setTimeout(() => setErrorMessage(''), 5000);
            }
        });
    };

    const sendToSelf = () => {
        fetch('/send-test-email')
            .then(response => response.json())
            .then(data => {
                setSuccessMessage(data.message);
                setTimeout(() => setSuccessMessage(''), 5000);
            })
            .catch(error => {
                setErrorMessage('Failed to send email: ' + error.message);
                setTimeout(() => setErrorMessage(''), 5000);
            });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Email Testing</h2>}
        >
            <Head title="Email Testing" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Test Email Functionality</h3>
                            
                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    {successMessage}
                                </div>
                            )}
                            
                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <p className="mb-2">
                                    Use this form to test email functionality. The test email will be sent to the specified email address.
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    Note: Make sure your mail configuration is properly set up in the .env file.
                                </p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="mb-4">
                                    <InputLabel htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                
                                {currentUser.role === 'admin' && users.length > 0 && (
                                    <div className="mb-4">
                                        <InputLabel htmlFor="userSelect" value="Or select a user" />
                                        <select
                                            id="userSelect"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setData('email', e.target.value)}
                                        >
                                            <option value="">Select a user</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.email}>
                                                    {user.name} ({user.email}) - {user.role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                <div className="flex items-center">
                                    <PrimaryButton disabled={processing}>
                                        Send Test Email
                                    </PrimaryButton>
                                </div>
                            </form>
                            
                            <div className="border-t pt-4">
                                <h4 className="text-md font-medium mb-2">Quick Test</h4>
                                <p className="mb-4 text-sm text-gray-600">
                                    Send a test email to yourself ({currentUser.email}) with one click.
                                </p>
                                <button
                                    onClick={sendToSelf}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    Send to Myself
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
