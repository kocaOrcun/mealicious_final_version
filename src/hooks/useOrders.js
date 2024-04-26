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
            async (snapshot) => {
                const fetchedOrders = [];
                for (const doc of snapshot.docs) {
                    const orderData = doc.data();
                    // Kullanıcının adını ve soyadını users tablosundan çekme
                    const userSnapshot = await db.collection('users').doc(orderData.userID).get();
                    const userData = userSnapshot.data();

                    fetchedOrders.push({
                        id: doc.id,
                        status: orderData.status,
                        tableNo: orderData.tableNo,
                        total: orderData.total,
                        userID: orderData.userID,
                        order: orderData.order || [],
                        userName: userData ? userData.name : '',
                        userSurname: userData ? userData.surname : '',
                    });
                }
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
