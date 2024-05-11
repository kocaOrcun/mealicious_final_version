// useOrders.js
import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthContext } from '../context/AuthContext'; // AuthContext'i import edin
import toast , {Toaster} from "react-hot-toast";

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext); // AuthContext'ten user değerini alın

    useEffect(() => {
        if (!user) { // Eğer kullanıcı giriş yapmamışsa, siparişleri çekme işlemi gerçekleştirilmez
            setLoading(false);
            return;
        }

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
    }, [user]); // user değiştiğinde useEffect Hook'unu tekrar çalıştır

    return { orders, loading, error };
};

export default useOrders;