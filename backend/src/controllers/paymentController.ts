
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'RAZORPAY_KEY_ID', // Replace or ensure env exists
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'RAZORPAY_KEY_SECRET'
});

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const amountPerTicket = 100; // in INR
        const totalAmount = quantity * amountPerTicket * 100; // in paise

        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Save initial order to database
        const payment = await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: totalAmount / 100, // Store in Rupees
                currency: order.currency,
                status: 'created',
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                quantity: quantity
            }
        });

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment successful
            await prisma.payment.update({
                where: { orderId: razorpay_order_id },
                data: {
                    status: 'paid',
                    paymentId: razorpay_payment_id
                }
            });

            res.json({ status: 'success', message: 'Payment verified successfully' });
        } else {
            // Signature mismatch
            await prisma.payment.update({
                where: { orderId: razorpay_order_id },
                data: { status: 'failed' }
            });
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};
