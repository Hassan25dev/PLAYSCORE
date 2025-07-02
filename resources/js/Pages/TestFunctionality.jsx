import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function TestFunctionality({ auth }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailStatus, setEmailStatus] = useState(null);
    const [pdfStatus, setPdfStatus] = useState(null);

    useEffect(() => {
        // Fetch some games to test PDF generation
        axios.get('/api/games')
            .then(response => {
                setGames(response.data.slice(0, 5)); // Just get the first 5 games
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching games:', error);
                setLoading(false);
            });
    }, []);

    const testEmailFunctionality = () => {
        setEmailStatus('sending');
        
        let endpoint = '/user-email-test';
        
        if (auth.user.role === 'developer') {
            endpoint = '/developer-email-test';
        } else if (auth.user.role === 'admin') {
            endpoint = '/admin/email-test';
        }
        
        axios.get(endpoint)
            .then(response => {
                setEmailStatus('success');
                setTimeout(() => setEmailStatus(null), 5000);
            })
            .catch(error => {
                console.error('Error sending test email:', error);
                setEmailStatus('error');
                setTimeout(() => setEmailStatus(null), 5000);
            });
    };

    const testPdfGeneration = (gameId) => {
        setPdfStatus('generating');
        
        let endpoint = `/test-pdf/${gameId}`;
        
        if (auth.user) {
            if (auth.user.role === 'developer') {
                endpoint = `/developer-test-pdf/${gameId}`;
            } else if (auth.user.role === 'admin') {
                endpoint = `/admin-test-pdf/${gameId}`;
            } else {
                endpoint = `/user-test-pdf/${gameId}`;
            }
        }
        
        // Open the PDF in a new tab
        window.open(endpoint, '_blank');
        
        setPdfStatus('success');
        setTimeout(() => setPdfStatus(null), 5000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Test Functionality</h2>}
        >
            <Head title="Test Functionality" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Test PDF Generation and Email Functionality</h3>
                            
                            <div className="mb-8">
                                <h4 className="text-md font-medium mb-2">Email Testing</h4>
                                <p className="mb-4">
                                    Test email functionality by sending a test email to your account ({auth.user.email}).
                                </p>
                                
                                <button
                                    onClick={testEmailFunctionality}
                                    disabled={emailStatus === 'sending'}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {emailStatus === 'sending' ? 'Sending...' : 'Send Test Email'}
                                </button>
                                
                                {emailStatus === 'success' && (
                                    <div className="mt-2 text-green-600">
                                        Email sent successfully! Check your inbox.
                                    </div>
                                )}
                                
                                {emailStatus === 'error' && (
                                    <div className="mt-2 text-red-600">
                                        Failed to send email. Check the server logs for details.
                                    </div>
                                )}
                                
                                {auth.user.role === 'admin' && (
                                    <div className="mt-4">
                                        <p>As an admin, you can also access the advanced email testing interface:</p>
                                        <a 
                                            href="/admin/email-test" 
                                            className="inline-block mt-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Go to Email Testing Interface
                                        </a>
                                    </div>
                                )}
                            </div>
                            
                            <div className="border-t pt-6">
                                <h4 className="text-md font-medium mb-2">PDF Generation Testing</h4>
                                <p className="mb-4">
                                    Test PDF generation by generating a PDF for one of the games below.
                                </p>
                                
                                {loading ? (
                                    <p>Loading games...</p>
                                ) : games.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {games.map(game => (
                                            <div key={game.id} className="border rounded-lg p-4">
                                                <h5 className="font-medium">{game.name}</h5>
                                                {game.background_image && (
                                                    <img 
                                                        src={game.background_image} 
                                                        alt={game.name}
                                                        className="w-full h-32 object-cover my-2 rounded"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => testPdfGeneration(game.id)}
                                                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                >
                                                    Generate PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No games available for testing.</p>
                                )}
                                
                                {pdfStatus === 'success' && (
                                    <div className="mt-4 text-green-600">
                                        PDF generated successfully! It should open in a new tab.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
