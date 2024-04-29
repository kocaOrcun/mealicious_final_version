// useOrders.js
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = firebase.firestore();

        const unsubscribe = db.collection('restaurant').doc('001').collection('orders').onSnapshot(
            async (snapshot) => {
                try {
                    const fetchedOrders = [];
                    snapshot.forEach((doc) => {
                        const orderData = doc.data();
                        const orderItems = orderData.orders.slice(0, 2);
                        fetchedOrders.push({
                            id: doc.id,
                            user_id : orderData.userId,
                            status: orderData.status,
                            tableNo: orderData.tableNo,
                            total: orderData.total,
                            orders: orderItems,
                        });
                    });
                    setOrders(fetchedOrders);
                    setLoading(false);
                    setError(null); // Reset error state if successful
                } catch (err) {
                    console.error('Error fetching orders: ', err);
                    setError(err);
                    setLoading(false);
                }
            },
            (err) => {
                console.error('Error fetching orders: ', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { orders, loading, error };
};

export default useOrders;
