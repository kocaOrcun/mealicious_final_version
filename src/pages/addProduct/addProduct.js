import React, { useContext } from 'react';
import useAddProduct from '../../hooks/useAddProduct';
import { AuthContext } from '../../context/AuthContext';
import './addProduct.css';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const { name, setName, description, setDescription, imageUrl, setImageUrl, ingredients, setIngredients, price, setPrice, addProduct, category, setCategory } = useAddProduct();

    const handleSubmit = (e) => {
        e.preventDefault();
        addProduct();
    };

    if (!user) {
        return <div>Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.</div>;
    }

    return (
        <div className="add-product-container">
            <h2>Ürün Ekle</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-group">
                    <label>Kategori:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required
                            className="form-control">
                        <option value="beverages">Beverages</option>
                        <option value="desserts">Desserts</option>
                        <option value="meals">Meals</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ürün Adı:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                           className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Açıklama:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required
                           className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Resim URL:</label>
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
                           className="form-control"/>
                </div>
                <div className="form-group">
                    <label>İçerik:</label>
                    <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required
                           className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Fiyat:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
                           className="form-control"/>
                </div>

                <button type="submit" className="btn btn-primary">Ekle</button>
            </form>
        </div>
    );
};

export default AddProduct;