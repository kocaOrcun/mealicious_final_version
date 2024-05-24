// useOrders.js
import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast'; // Import toast from react-toastify

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
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const orderData = change.doc.data();
                            const orderItems = orderData.orders.slice(0, 2);
                            const newOrder = {
                                id: change.doc.id,
                                user_id : orderData.userId,
                                status: orderData.status,
                                tableNo: orderData.tableNo,
                                total: orderData.total,
                                orders: orderItems,
                            };
                            setOrders(prevOrders => [...prevOrders, newOrder]); // Add the new order to the existing list
                            toast.success("New order received!"); // Show a toast notification for the new order
                        }
                    });
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