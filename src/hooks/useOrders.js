// useOrders.js
import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const db = firebase.firestore();

        const unsubscribe = db.collection('restaurant').doc('001').collection('orders').onSnapshot(
            async (snapshot) => {
                try {
                    let newOrders = [];
                    let modifiedOrders = [];

                    snapshot.docChanges().forEach((change) => {
                        const orderData = change.doc.data();
                        const newOrder = {
                            id: change.doc.id,
                            user_id: orderData.userId,
                            status: orderData.status,
                            tableNo: orderData.tableNo,
                            total: orderData.total,
                            notes: orderData.notes,
                            orders: orderData.orders, // Get all order items
                            timestamp: Date.now(), // Add a timestamp to each order
                        };
                        if (change.type === "added") {
                            newOrders.push(newOrder);
                        } else if (change.type === "modified") {
                            modifiedOrders.push(newOrder);
                        }
                    });

                    if (newOrders.length > 0) {
                        setOrders(prevOrders => [...newOrders, ...prevOrders]);
                        toast.success(`${newOrders.length} new order(s) received!`);
                    }

                    if (modifiedOrders.length > 0) {
                        setOrders(prevOrders => prevOrders.map(order => {
                            const modifiedOrder = modifiedOrders.find(o => o.id === order.id);
                            return modifiedOrder ? modifiedOrder : order;
                        }));
                    }

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
    }, [user]);

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    return { orders, loading, error, getOrdersByStatus };
};

export default useOrders;
