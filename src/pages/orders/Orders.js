import React, { useState, useEffect, useContext } from 'react';
import useOrders from '../../hooks/useOrders';
import { AuthContext } from '../../context/AuthContext';
import {toast} from "react-hot-toast";
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
    const Toast = toast;

    const handleCheckboxChange = async (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedOrders([]); // Deselect all orders
        } else {
            // Select only the orders that match the current filter
            let filteredOrders = orders;
            if (filter === 'new') {
                filteredOrders = orders.filter(order => order.status === 0);
            } else if (filter === 'preparing') {
                filteredOrders = orders.filter(order => order.status === 1);
            } else if (filter === 'delivered') {
                filteredOrders = orders.filter(order => order.status === 2);
            }
            setSelectedOrders(filteredOrders.map(order => order.id));
        }
        setSelectAll(!selectAll);
    };

    const handleStatusChange = async () => {
        try {
            setUpdatingStatus(true);
            const db = firebase.firestore();
            for (const orderId of selectedOrders) {
                const order = orders.find(order => order.id === orderId);
                if (order) {
                    // Check if the order can be updated to the new status
                    if ((order.status === 0 && orderStatus === '1') || // New -> Preparing
                        (order.status === 1 && orderStatus === '2')) { // Preparing -> Delivered
                        await db.collection('restaurant').doc('001').collection('orders').doc(orderId).update({
                            status: parseInt(orderStatus, 10)
                        });
                    } else {
                        console.error(`Cannot update order ${orderId} from status ${order.status} to ${orderStatus}`);
                        toast.error(`Cannot update order ${orderId} from status ${order.status} to ${orderStatus}`); // Show an error toast
                    }
                }
            }
            setSelectedOrders([]);
            reload();
        } catch (error) {
            console.error('Error updating order status:', error);
            //toast.error('Error updating order status: ' + error.message); // Show an error toast
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
                if (userData) { // Check if userData is defined before accessing its properties
                    newNames[order.user_id] = `${userData.name} ${userData.surname}`;
                }
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
    } else if (filter === 'delivered') {
        filteredOrders = orders.filter(order => order.status === 2);
    }

    // Sort orders by status
    filteredOrders.sort((a, b) => b.status - a.status);

    return (
        <div>
            <h1 className="orders-title">Orders</h1>
            <div>
                <button onClick={() => setFilter('new')}>New Orders
                    ({orders.filter(order => order.status === 0).length})
                </button>
                <button onClick={() => setFilter('preparing')}>Preparing Orders
                    ({orders.filter(order => order.status === 1).length})
                </button>
                <button onClick={() => setFilter('delivered')}>Delivered Orders
                    ({orders.filter(order => order.status === 2).length})
                </button>
                <button onClick={() => setFilter('all')}>All Orders ({orders.length})</button>
            </div>
            <div>
                <select onChange={(e) => setOrderStatus(e.target.value)}>
                    <option value="">Select status</option>
                    <option value="0">New</option>
                    <option value="1">Preparing</option>
                    <option value="2">Delivered</option>
                </select>
                <button onClick={handleStatusChange} disabled={updatingStatus}>
                    {updatingStatus ? "Status Updating..." : "Update Status"}
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
            <th>Image</th>
            <th>Customer</th>
            <th>Table No</th>
            <th>Price</th>
            <th>Orders</th>
        </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
            <tr key={order.id} style={{backgroundColor: order.status === 0 && Date.now() - order.timestamp < 30000 ? 'lightyellow' : 'white'}}>
                <td>
                    <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                    />
                </td>
                <td>{order.status === 0 ? "New" : order.status === 1 ? "Preparing" : "Delivered"}</td>
                <td>
                    {/* Add this to display the image */}
                    {order.orders.map((item, index) => (
                        <img key={index} src={item.imageUrl} alt={item.name} style={{width: '50px', height: '50px'}}/>
                    ))}
                </td>
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

            </tr>
        ))}
        </tbody>
    </table>
);


export default Orders;