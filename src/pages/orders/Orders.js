import React, { useState, useEffect, useContext } from 'react';
import { Table, Checkbox, Button, Select, Spin, Typography, message } from 'antd';
import useOrders from '../../hooks/useOrders';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import firebase from 'firebase/app';
import 'firebase/firestore';
import './Orders.css';

const { Option } = Select;
const { Title } = Typography;

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
                        message.error(`Cannot update order ${orderId} from status ${order.status} to ${orderStatus}`); // Show an error toast
                    }
                }
            }
            setSelectedOrders([]);
            reload();
        } catch (error) {
            console.error('Error updating order status:', error);
            //message.error('Error updating order status: ' + error.message); // Show an error toast
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
        return <Spin tip="Veriler yükleniyor..." />;
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

    const columns = [
        {
            title: <Checkbox checked={selectAll} onChange={handleSelectAllChange} />,
            dataIndex: 'checkbox',
            render: (_, record) => (
                <Checkbox
                    checked={selectedOrders.includes(record.id)}
                    onChange={() => handleCheckboxChange(record.id)}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => (status === 0 ? 'New' : status === 1 ? 'Preparing' : 'Delivered'),
        },
        {
            title: 'Image',
            dataIndex: 'orders',
            render: orders => (
                <div>
                    {orders.map((item, index) => (
                        <img key={index} src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                    ))}
                </div>
            ),
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            render: orders => (
                <ul>
                    {orders.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.quantity}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'user_id',
            render: userId => userNames[userId],
        },
        {
            title: 'Table No',
            dataIndex: 'tableNo',
        },
        {
            title: 'Price',
            dataIndex: 'total',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
        },
    ];

    return (
        <div>
            <Title className="orders-title">Orders</Title>
            <div style={{ marginBottom: 16 }}>
                <Button onClick={() => setFilter('new')}>New Orders ({orders.filter(order => order.status === 0).length})</Button>
                <Button onClick={() => setFilter('preparing')}>Preparing Orders ({orders.filter(order => order.status === 1).length})</Button>
                <Button onClick={() => setFilter('delivered')}>Delivered Orders ({orders.filter(order => order.status === 2).length})</Button>
                <Button onClick={() => setFilter('all')}>All Orders ({orders.length})</Button>
            </div>
            <div style={{ marginBottom: 16 }}>
                <Select style={{ width: 200 }} onChange={value => setOrderStatus(value)} placeholder="Select status">
                    <Option value="0">New</Option>
                    <Option value="1">Preparing</Option>
                    <Option value="2">Delivered</Option>
                </Select>
                <Button type="primary" onClick={handleStatusChange} disabled={updatingStatus} loading={updatingStatus} style={{ marginLeft: 8 }}>
                    Update Status
                </Button>
            </div>
            <Table
                dataSource={filteredOrders}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 20 }}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : ''}
            />
        </div>
    );
};

export default Orders;

