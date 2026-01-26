import { useState } from 'react';
import { useDevices } from '../hooks/useDevices';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterDevice = () => {
    const { registerDevice, isRegistering } = useDevices();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ model: '', description: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.model) {
            setError('Model name is required');
            return;
        }

        if (formData.recycleNumber && formData.recycleNumber.length !== 8) {
            setError('Recycle number must be exactly 8 digits');
            return;
        }

        registerDevice(formData, {
            onSuccess: () => {
                navigate('/citizen');
            },
            onError: (err) => {
                setError(err.response?.data?.error || 'Registration failed');
            }
        });
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
            <button
                onClick={() => navigate('/citizen')}
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Device</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. iPhone 11, Dell Latitute"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="Condition, serial number (optional), etc."
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Unique Recycle Number</label>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optional</span>
                    </div>
                    <input
                        type="text"
                        maxLength={8}
                        className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono tracking-widest"
                        placeholder="8-Digit ID (e.g. 12345678)"
                        value={formData.recycleNumber || ''}
                        onChange={(e) => setFormData({ ...formData, recycleNumber: e.target.value.replace(/\D/g, '') })}
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed italic">
                        * Only for modern devices with a 8-digit ID printed on the chassis.
                        Legacy devices can leave this blank.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isRegistering ? <Loader2 className="animate-spin" size={20} /> : 'Register Device'}
                </button>
            </form>
        </div>
    );
};

export default RegisterDevice;
