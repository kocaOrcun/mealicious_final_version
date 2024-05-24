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
                    snapshot.docChanges().forEach((change) => {
                        const orderData = change.doc.data();
                        const orderItems = orderData.orders.slice(0, 2);
                        const newOrder = {
                            id: change.doc.id,
                            user_id : orderData.userId,
                            status: orderData.status,
                            tableNo: orderData.tableNo,
                            total: orderData.total,
                            orders: orderItems,
                            timestamp: Date.now(), // Add a timestamp to each order
                        };
                        if (change.type === "added") {
                            setOrders(prevOrders => [newOrder, ...prevOrders]); // Add the new order to the top of the list
                            toast.success("New order received!"); // Show a toast notification for the new order
                        } else if (change.type === "modified") {
                            setOrders(prevOrders => prevOrders.map(order => order.id === newOrder.id ? newOrder : order)); // Update the order in the existing list
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