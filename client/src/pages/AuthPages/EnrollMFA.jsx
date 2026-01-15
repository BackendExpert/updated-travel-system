import React, { useEffect, useState } from 'react';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import { useNavigate } from 'react-router-dom';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import API from '../../services/api'; 

const EnrollMFA = () => {
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({ otp: '' });
    const [mfaToken, setMfaToken] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("mfaToken");
        if (!token) {
            navigate("/", { replace: true });
            return;
        }
        setMfaToken(token);
    }, [navigate]);


    useEffect(() => {
        if (!mfaToken) return;

        const fetchEnrollState = async () => {
            try {
                const res = await API.post(
                    "/auth/mfa/enroll",
                    {}, 
                    {
                        headers: {
                            Authorization: `Bearer ${mfaToken}`, 
                        }
                    }
                );

                if (res.data.qrCode) {
                    setQrCode(res.data.qrCode);
                } else {
                    setQrCode(null); 
                }

            } catch (err) {
                console.error("MFA enroll fetch error:", err.response?.data || err.message);
                navigate("/", { replace: true });
            }
        };

        fetchEnrollState();
    }, [mfaToken, navigate]);


    const handleVerifyMFA = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/auth/mfa/verify",
                { token: values.otp.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${mfaToken}`,
                    }
                }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.removeItem("mfaToken");

            setToast({ success: true, message: "MFA verified successfully!" });
            setTimeout(() => navigate("/dashboard", { replace: true }), 1500);

        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Invalid MFA code"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 pt-32'>
            {toast && (
                <div className="absolute top-5 right-5 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            {qrCode && (
                <div className="mb-4 text-center">
                    <img src={qrCode} alt="MFA QR Code" className="mx-auto" />
                    <p className="text-sm mt-2">Scan with your Authenticator app</p>
                </div>
            )}

            <form onSubmit={handleVerifyMFA}>
                <DefaultInput
                    placeholder="Enter 6-digit code"
                    type='text'
                    value={values.otp}
                    name='otp'
                    onChange={handleChange}
                    required
                    disabled={loading} 
                />

                <DefaultButton
                    type="submit"
                    label={loading ? "Verifying..." : "Verify MFA"}
                    disabled={loading} 
                />
            </form>
        </div>
    );
};

export default EnrollMFA;
