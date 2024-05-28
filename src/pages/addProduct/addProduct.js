import React, { useContext } from 'react';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import useAddProduct from '../../hooks/useAddProduct';
import { AuthContext } from '../../context/AuthContext';
import './addProduct.css';
import { useHistory } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const { name, setName, description, setDescription, imageUrl, setImageUrl, ingredients, setIngredients, price, setPrice, addProduct, category, setCategory, resetForm } = useAddProduct();
    const history = useHistory();
    const handleSubmit = () => {
        addProduct();
        message.success('Ürün başarıyla eklendi!');
        resetForm();
        history.push('/addProduct'); // Kullanıcıyı 'addProduct' sayfasına yönlendirir
    };

    if (!user) {
        return <div>Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.</div>;
    }

    return (
        <div className="add-product-container">
            <Title level={2}>Ürün Ekle</Title>
            <Form
                onFinish={handleSubmit}
                layout="vertical"
                className="add-product-form"
            >
                <Form.Item
                    label="Kategori"
                    name="category"
                    rules={[{ required: true, message: 'Lütfen bir kategori seçin!' }]}
                >
                    <Select value={category} onChange={(value) => setCategory(value)}>
                        <Option value="beverages">Beverages</Option>
                        <Option value="desserts">Desserts</Option>
                        <Option value="meals">Meals</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ürün Adı"
                    name="name"
                    rules={[{ required: true, message: 'Lütfen ürün adını girin!' }]}
                >
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Açıklama"
                    name="description"
                    rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}
                >
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Resim URL"
                    name="imageUrl"
                    rules={[{ required: true, message: "Lütfen resim URL'sini girin!" }]}
                >
                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="İçerik"
                    name="ingredients"
                    rules={[{ required: true, message: 'Lütfen içerik girin!' }]}
                >
                    <Input value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Fiyat"
                    name="price"
                    rules={[{ required: true, message: 'Lütfen fiyatı girin!' }]}
                >
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Ekle
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;
