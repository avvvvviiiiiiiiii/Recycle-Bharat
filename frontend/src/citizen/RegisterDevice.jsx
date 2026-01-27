import { useState } from 'react';
import { useDevices } from '../hooks/useDevices';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const RegisterDevice = () => {
    const { registerDevice, isRegistering } = useDevices();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        model: '',
        brand: '',
        device_type: 'Smartphone',
        purchase_year: new Date().getFullYear(),
        serial_number: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        registerDevice(formData, {
            onSuccess: () => {
                navigate('/citizen');
            },
            onError: (err) => {
                setError(err.response?.data?.message || 'Registration failed');
            }
        });
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
            <button
                onClick={() => navigate('/citizen')}
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6"
            >
                <ArrowLeft size={16} /> {t.backToDashboard}
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.registerDevice}</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="device_type" className="block text-sm font-medium text-gray-700 mb-1">{t.deviceType}</label>
                    <select
                        id="device_type"
                        name="device_type"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        value={formData.device_type}
                        onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    >
                        <option value="Smartphone">Smartphone</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Smartwatch">Smartwatch</option>
                        <option value="Audio">Audio Device</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">{t.brand}</label>
                    <input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. Samsung, Apple, Dell"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">{t.model}</label>
                    <input
                        id="model"
                        name="model"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. Galaxy S21"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="purchase_year" className="block text-sm font-medium text-gray-700 mb-1">{t.purchaseYear}</label>
                        <input
                            id="purchase_year"
                            name="purchase_year"
                            type="number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            value={formData.purchase_year}
                            onChange={(e) => setFormData({ ...formData, purchase_year: parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">{t.serialNumber}</label>
                        <input
                            id="serial_number"
                            name="serial_number"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4"
                >
                    {isRegistering ? <Loader2 className="animate-spin" size={20} /> : t.registerDevice}
                </button>
            </form>
        </div>
    );
};

export default RegisterDevice;
