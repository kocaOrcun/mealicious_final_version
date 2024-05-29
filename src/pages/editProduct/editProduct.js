import React, { useContext, useState } from "react";
import useEditProduct from "../../hooks/useEditProduct";
import { AuthContext } from '../../context/AuthContext';
import { Modal, Button, Form, Input, Table, Typography, Select, Space, Image, message, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const EditProduct = () => {
    const { beverages, desserts, meals, editProduct, deleteProduct } =
        useEditProduct();
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { user } = useContext(AuthContext);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleEdit = (category, product) => {
        setEditingProduct({ ...product });
        setEditingCategory(category);
    };

    const handleSave = async () => {
        if (editingProduct && editingCategory) {
            try {
                const updatedProduct = {
                    ...editingProduct,
                    price: parseFloat(editingProduct.price)
                };
                const file = fileList[0]?.originFileObj; // Kullanıcının yüklediği dosyayı al
                await editProduct(editingCategory, updatedProduct, file); // Dosyayı editProduct fonksiyonuna geç
                setEditingProduct(null);
                setEditingCategory(null);
                message.success("Ürün başarıyla güncellendi");
            } catch (error) {
                console.error("Failed to edit product: ", error);
                message.error("Ürün güncelleme başarısız oldu");
            }
        }
    };

    const handleDelete = (category, product) => {
        Modal.confirm({
            title: 'Ürünü silmek istediğinize emin misiniz?',
            content: 'Bu işlem geri alınamaz.',
            okText: 'Evet',
            okType: 'danger',
            cancelText: 'Hayır',
            onOk: async () => {
                try {
                    await deleteProduct(category, { ...product });
                    message.success("Ürün başarıyla silindi");
                } catch (error) {
                    console.error("Failed to delete product: ", error);
                    message.error("Ürün silme başarısız oldu");
                }
            },
        });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleFileChange = (info) => {
        setFileList(info.fileList);
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setEditingCategory(null);
    };

    if (!user) {
        return <div>Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.</div>;
    }

    return (
        <div className="edit-product-container">
            {editingProduct ? (
                <div>
                    <Title level={2}>Edit Product</Title>
                    <Form layout="vertical">
                        <Form.Item label="Ad">
                            <Input
                                value={editingProduct.name}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, name: e.target.value })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Açıklama">
                            <Input
                                value={editingProduct.description}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Resim">
                            <Upload
                                name="image"
                                listType="picture"
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                                fileList={fileList}
                            >
                                <Button icon={<UploadOutlined />}>Resim Değiştir</Button>
                            </Upload>
                            {uploadProgress > 0 && (
                                <Progress percent={Math.round(uploadProgress)} />
                            )}
                            {editingProduct && editingProduct.imageUrl && (
                                <img src={editingProduct.imageUrl} alt="current" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                            )}
                        </Form.Item>
                        <Form.Item label="Malzemeler">
                            <Input
                                value={editingProduct.ingredients}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        ingredients: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Fiyat">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingProduct.price}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Button type="primary" onClick={handleSave}>
                            Kaydet
                        </Button>
                        <Button onClick={handleCancel}>
                            İptal
                        </Button>
                    </Form>
                </div>
            ) : (
                <>
                    <Title level={2}>Choose Category:</Title>
                    <Space>
                        {["beverages", "desserts", "meals"].map((category, index) => (
                            <Button key={index} onClick={() => handleCategoryChange(category)}>
                                {category}
                            </Button>
                        ))}
                    </Space>
                    {selectedCategory && (
                        <>
                            <Title level={2}>{selectedCategory}</Title>
                            <Table
                                dataSource={
                                    selectedCategory === "beverages"
                                        ? beverages
                                        : selectedCategory === "desserts"
                                            ? desserts
                                            : meals
                                }
                                rowKey="name"
                            >
                                <Table.Column title="Product Name" dataIndex="name" key="name" />
                                <Table.Column title="Description" dataIndex="description" key="description" />
                                <Table.Column
                                    title="Image"
                                    dataIndex="imageUrl"
                                    key="imageUrl"
                                    render={(text, record) => (
                                        <Image
                                            src={text}
                                            alt={record.name}
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                />
                                <Table.Column title="Ingredients" dataIndex="ingredients" key="ingredients" />
                                <Table.Column title="Price" dataIndex="price" key="price" />
                                <Table.Column
                                    title="Actions"
                                    key="actions"
                                    render={(text, record) => (
                                        <Space>
                                            <Button onClick={() => handleEdit(selectedCategory, { ...record })}>
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(selectedCategory, { ...record })} danger>
                                                Delete
                                            </Button>
                                        </Space>
                                    )}
                                />
                            </Table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default EditProduct;
