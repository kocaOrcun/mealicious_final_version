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
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <p>ID: {order.id}</p>
                        <p>Status: {order.status}</p>
                        <p>Table No: {order.tableNo}</p>
                        <p>Total: {order.total}</p>
                        <p>User ID: {order.userID}</p>
                        {/* Kullanıcı adı ve soyadını görüntüleme */}
                        <p>User Name: {order.userName}</p>
                        <p>User Surname: {order.userSurname}</p>
                        {/* order array'ini görüntülemek için bir liste ekleyin */}
                        <p>Order:</p>
                        <ul>
                            {order.order.map((item, index) => (
                                <li key={index}>
                                    {item.name} - {item.quantity} - {item.notes}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Orders;
