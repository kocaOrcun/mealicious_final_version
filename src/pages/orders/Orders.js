// Orders.jsx
import React, { useState, useEffect, useContext } from 'react';
import useOrders from '../../hooks/useOrders';
import { AuthContext } from '../../context/AuthContext';
import firebase from 'firebase/app';
import 'firebase/firestore';
import './Orders.css';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const { orders, loading, error, reload } = useOrders();
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [filter, setFilter] = useState('all');
    const [orderStatus, setOrderStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    const handleCheckboxChange = async (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(order => order.id));
        }
        setSelectAll(!selectAll);
    };

    const handleStatusChange = async () => {
        try {
            setUpdatingStatus(true);
            const db = firebase.firestore();
            for (const orderId of selectedOrders) {
                await db.collection('restaurant').doc('001').collection('orders').doc(orderId).update({
                    status: parseInt(orderStatus, 10)
                });
            }
            setSelectedOrders([]);
            reload();
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        const fetchUserNames = async () => {
            const db = firebase.firestore();
            const newNames = {};

            for (const order of orders) {
                const userDoc = await db.collection('users').doc(order.user_id).get();
                const userData = userDoc.data();
                newNames[order.user_id] = `${userData.name} ${userData.surname}`;
            }

            setUserNames(newNames);
        };

        fetchUserNames();
    }, [orders, selectedOrders]);

    if (!user) {
        return <div>Kullanıcı giriş yapmadı. Siparişleri görmek için giriş yapmalısınız.</div>;
    }

    if (loading) {
        return <p>Veriler yükleniyor...</p>;
    }

    if (error) {
        return <p>Hata: {error.message}</p>;
    }

    let filteredOrders = orders;
    if (filter === 'new') {
        filteredOrders = orders.filter(order => order.status === 0);
    } else if (filter === 'preparing') {
        filteredOrders = orders.filter(order => order.status === 1);
    }

    return (
        <div>
            <h1 className="orders-title">Siparişler</h1>
            <div>
                <button onClick={() => setFilter('new')}>Yeni Siparişler
                    ({orders.filter(order => order.status === 0).length})
                </button>
                <button onClick={() => setFilter('preparing')}>Hazırlanmakta Olan Siparişler
                    ({orders.filter(order => order.status === 1).length})
                </button>
                <button onClick={() => setFilter('all')}>Tüm Siparişler ({orders.length})</button>
            </div>
            <div>
                <select onChange={(e) => setOrderStatus(e.target.value)}>
                    <option value="">Durum Seçin</option>
                    <option value="0">Yeni</option>
                    <option value="1">Hazırlanmakta</option>
                </select>
                <button onClick={handleStatusChange} disabled={updatingStatus}>
                    {updatingStatus ? "Durum Güncelleniyor..." : "Durumu Güncelle"}
                </button>
            </div>
            {renderOrdersTable(filteredOrders, selectedOrders, handleCheckboxChange, userNames, selectAll, handleSelectAllChange)}
        </div>
    );
};

const renderOrdersTable = (orders, selectedOrders, handleCheckboxChange, userNames, selectAll, handleSelectAllChange) => (
    <table className="orders-table">
        <thead>
        <tr>
            <th>
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            </th>
            <th>Status</th>
            <th>Customer</th>
            <th>Table No</th>
            <th>Price</th>
            <th>Orders</th>
            <th>Orders Id</th>
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
                <td>{order.status === 1 ? "Preparing" : "New"}</td>
                <td>{userNames[order.user_id]}</td>
                <td>{order.tableNo}</td>
                <td>{order.total}</td>
                <td>
                    <ul>
                        {order.orders.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.quantity}
                            </li>
                        ))}
                    </ul>
                </td>
                <td>{order.id}</td>
            </tr>
        ))}
        </tbody>
    </table>
);

export default Orders;