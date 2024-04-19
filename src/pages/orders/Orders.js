import React from 'react';
import useOrders from '../../hooks/useOrders'

const Orders = () => {
    const { orders, loading, error } = useOrders();

    if (loading) {
        return <p>Veriler yükleniyor...</p>;
    }

    if (error) {
        return <p>Hata: {error.message}</p>;
    }

    return (
        <div>
            <h1>Siparişler</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <p>ID: {order.id}</p>
                        <p>Status: {order.status}</p>
                        <p>Table No: {order.tableNo}</p>
                        {/* Diğer sipariş detayları */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Orders;
