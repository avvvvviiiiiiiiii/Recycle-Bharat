import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const DebugStatus = () => {
    const { user } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-[9999] pointer-events-none opacity-75 hover:opacity-100 transition-opacity max-w-sm">
            <h3 className="font-bold border-b border-gray-600 mb-2 pb-1 text-emerald-400">System State</h3>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-400">Path:</span>
                    <span>{location.pathname}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">User:</span>
                    <span className={user ? "text-green-400" : "text-red-400"}>
                        {user ? 'LOGGED IN' : 'NULL'}
                    </span>
                </div>
                {user && (
                    <>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Role:</span>
                            <span>{user.role}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">UID:</span>
                            <span>{user.id}</span>
                        </div>
                    </>
                )}
                <div className="flex justify-between">
                    <span className="text-gray-400">Token:</span>
                    <span className={token ? "text-green-400" : "text-red-400"}>
                        {token ? `${token.substring(0, 8)}...` : 'MISSING'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DebugStatus;
