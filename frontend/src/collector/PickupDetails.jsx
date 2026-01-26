import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Phone, Package, ShieldCheck, Navigation } from 'lucide-react';

const mockJobDetails = {
    id: '101',
    device: 'Samsung Galaxy S21',
    uid: 'DVC-8839-X92',
    citizenName: 'Amit Sharma',
    address: 'Flat 402, Green Valley Apts, Bandra West, Mumbai',
    distance: '2.5 km',
    contact: '+91 98765 43210',
    status: 'PENDING_PICKUP',
};

export default function PickupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');

    // Real app would fetch based on ID.
    const job = mockJobDetails;

    const handleConfirmPickup = () => {
        if (otp.length !== 4) {
            alert("Please enter a valid 4-digit OTP");
            return;
        }
        // Call API to transition state
        alert("Pickup Confirmed! Device is now in COLLECTED state.");
        navigate('/collector/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white pl-0 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Assignments
            </Button>

            {/* Map Placeholder Card */}
            <div className="h-48 bg-slate-800/50 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/72.8777,19.0760,12,0/800x400?access_token=PLACEHOLDER')] bg-cover bg-center" />
                <Button variant="secondary" className="relative z-10 gap-2">
                    <Navigation className="w-4 h-4" /> Open Navigation
                </Button>
            </div>

            {/* Details Card */}
            <div className="bg-card/40 border border-white/10 rounded-xl p-6 space-y-6">

                {/* Customer Info */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                        {job.citizenName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{job.citizenName}</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                            <Phone className="w-3 h-3" /> {job.contact}
                        </div>
                    </div>
                    <a href={`tel:${job.contact}`} className="ml-auto">
                        <Button size="sm" variant="outline" className="h-9">Call</Button>
                    </a>
                </div>

                <div className="h-px bg-white/5" />

                {/* Address */}
                <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-slate-500 mt-1" />
                    <p className="text-slate-300 text-sm leading-relaxed">{job.address}</p>
                </div>

                <div className="h-px bg-white/5" />

                {/* Device Info */}
                <div className="bg-slate-950/30 p-4 rounded-lg border border-white/5">
                    <div className="text-xs text-muted-foreground uppercase mb-2 font-semibold">Device to Collect</div>
                    <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{job.device}</span>
                        <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{job.uid}</span>
                    </div>
                </div>

                {/* Action Area */}
                <div className="bg-blue-900/10 border border-blue-500/20 p-5 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-medium">
                        <ShieldCheck className="w-5 h-5" /> Verify Handover
                    </div>
                    <p className="text-xs text-blue-300/70">Ask citizen for the 4-digit pickup code shown in their app.</p>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter 4-Digit OTP"
                            className="bg-slate-950/50 border-blue-500/30 focus:border-blue-500 font-mono text-center tracking-widest text-lg"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button onClick={handleConfirmPickup} className="bg-blue-600 hover:bg-blue-500 w-32 shrink-0">
                            Confirm
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
