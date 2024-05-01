// Orders.jsx
import React, { useState } from 'react';
import useOrders from '../../hooks/useOrders';
import './Orders.css';

const Orders = () => {
    const { orders, loading, error } = useOrders();
    const [selectedOrders, setSelectedOrders] = useState([]); // Seçili siparişleri saklayacak state

    const handleCheckboxChange = (orderId) => {
        // Checkbox durumunu güncelle
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId)); // Seçili siparişi kaldır
        } else {
            setSelectedOrders([...selectedOrders, orderId]); // Seçili siparişi ekle
        }
    };

    if (loading) {
        return <p>Veriler yükleniyor...</p>;
    }

    if (error) {
        return <p>Hata: {error.message}</p>;
    }

    return (
        <div>
            <h1 className="orders-title">Siparişler</h1>
            <table className="orders-table">
                <thead>
                <tr>
                    <th></th> {/* Checkbox için boş hücre */}
                    <th>ID</th>
                    <th>Durum</th>
                    <th>Masa No</th>
                    <th>Toplam</th>
                    <th>Sipariş Ürünleri</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => handleCheckboxChange(order.id)}
                            />
                        </td>
                        <td>{order.id}</td>
                        <td>{order.status === 1 ? "Ready" : "Preparing"}</td>
                        <td>{order.tableNo}</td>
                        <td>{order.total}</td>
                        <td>
                            <ul>
                                {order.orders.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} - {item.notes}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
