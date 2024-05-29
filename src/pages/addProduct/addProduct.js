import React, { useContext, useState } from 'react';
import { Form, Input, Button, Select, message, Typography, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useAddProduct from '../../hooks/useAddProduct';
import { AuthContext } from '../../context/AuthContext';
import './addProduct.css';
import { useHistory } from 'react-router-dom';
import 'firebase/storage'; // Firebase Storage modülünü dahil edin

const { Option } = Select;
const { Title } = Typography;

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const {
        name, setName,
        description, setDescription,
        imageUrl, setImageUrl,
        ingredients, setIngredients,
        price, setPrice,
        addProduct, handleImageUpload, category, setCategory,
        resetForm,
    } = useAddProduct();
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const history = useHistory();

    const handleSubmit = async () => {
        if (fileList.length > 0) {
            try {
                const file = fileList[0].originFileObj;
                const downloadURL = await handleImageUpload(file, category, setUploadProgress);
                await addProduct(downloadURL);
                message.success('Ürün başarıyla eklendi!');
                resetForm();
                setUploadProgress(0);
                setFileList([]);
                history.push('/editProduct'); // Ürün eklemeden sonra ana sayfaya yönlendirme
            } catch (error) {
                message.error('Resim yüklenirken bir hata oluştu.');
            }
        } else {
            message.error('Lütfen bir resim yükleyin.');
        }
    };

    const handleFileChange = (info) => {
        setFileList(info.fileList);
    };

    if (!user) {
        return <div>Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.</div>;
    }

    return (
        <div className="add-product-container">
            <Title level={2}>Add Product</Title>
            <Form
                onFinish={handleSubmit}
                layout="vertical"
                className="add-product-form"
            >
                <Form.Item
                    label="Category"
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
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Lütfen ürün adını girin!' }]}
                >
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}
                >
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Upload Image"
                    name="image"
                >
                    <Upload
                        name="image"
                        listType="picture"
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        fileList={fileList}
                    >
                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                </Form.Item>
                {uploadProgress > 0 && (
                    <Form.Item>
                        <Progress percent={Math.round(uploadProgress)} />
                    </Form.Item>
                )}
                <Form.Item
                    label="Ingredients"
                    name="ingredients"
                    rules={[{ required: true, message: 'Lütfen içerik girin!' }]}
                >
                    <Input value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Lütfen fiyatı girin!' }]}
                >
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;
