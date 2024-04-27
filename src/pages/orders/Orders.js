import React from 'react';
import useOrders from '../../hooks/useOrders';

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
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Masa No</th>
                    <th>Toplam</th>
                    <th>Sipariş Ürünleri</th>
                    {/* User bilgileri sorgulanmadığı için, bu alanları eklemiyorum */}
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.status}</td>
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
