import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Razorpay configuration missing' },
                { status: 500 }
            );
        }

        if (!process.env.SUBSCRIPTION_PLAN_ID) {
            return NextResponse.json(
                { error: 'Subscription plan ID not configured' },
                { status: 500 }
            );
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });

        const result = await instance.subscriptions.create({
            plan_id: process.env.SUBSCRIPTION_PLAN_ID,
            customer_notify: 1,
            quantity: 1,
            total_count: 1,
            addons: [],
            notes: {
                key1: 'Subscription created via Creator AI'
            }
        });

        return NextResponse.json({
            success: true,
            subscription: result
        });

    } catch (error: any) {
        console.error('Subscription creation failed:', error);
        return NextResponse.json(
            { 
                error: 'Failed to create subscription', 
                details: error.message 
            },
            { status: 500 }
        );
    }
}