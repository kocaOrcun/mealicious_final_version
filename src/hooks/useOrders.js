import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Firebase Firestore referansı
        const db = firebase.firestore();

        // "orders" koleksiyonundan verileri çekme
        const unsubscribe = db.collection('orders').onSnapshot(
            (snapshot) => {
                const fetchedOrders = [];
                snapshot.forEach((doc) => {
                    fetchedOrders.push({
                        id: doc.id, ...doc.data(),
                        status: doc.status, ...doc.data(),
                        tableNo: doc.tableNo,...doc.data()  });
                });
                setOrders(fetchedOrders);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching orders: ', err);
                setError(err);
                setLoading(false);
            }
        );

        // Component unmount olduğunda listener'ı temizleme
        return () => unsubscribe();
    }, []);

    return { orders, loading, error };
};

export default useOrders;
