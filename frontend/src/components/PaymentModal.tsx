
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, User, Mail, Phone, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        quantity: 1,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isOpen) return null;

    const totalAmount = formData.quantity * 100;

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
            const { data: orderData } = await api.post('/payments/create-order', formData);

            const options = {
                key: orderData.key_id, // Enter the Key ID generated from the Dashboard
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Quantica",
                description: "General Pass Transaction",
                image: "https://your-logo-url.com/logo.png", // Optional: Add actual logo URL
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 2. Verify Payment
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.status === 'success') {
                            toast.success('Payment Successful! Ticket booked.');
                            onClose();
                            setFormData({ name: '', email: '', phone: '', quantity: 1 });
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#8b5cf6" // Primary theme color
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (error) {
            console.error('Payment initialization failed:', error);
            toast.error('Failed to initialize payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-card border-2 border-border clip-corner relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-play">General Pass</h2>
                                    <p className="text-sm text-muted-foreground">Secure your spot at Quantica</p>
                                </div>
                            </div>

                            <form onSubmit={handlePay} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal Details</label>

                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-background border border-border focus:border-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-background border border-border focus:border-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-background border border-border focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Details</label>
                                    <div className="flex items-center justify-between p-3 bg-muted/20 border border-border">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium">Quantity</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                                                className="w-6 h-6 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-bold">{formData.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, quantity: Math.min(10, p.quantity + 1) }))}
                                                className="w-6 h-6 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full cyber-btn py-3 font-bold text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></span>
                                        ) : (
                                            'PROCEED TO PAY'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
