import React, { useState } from 'react';
import useEditProduct from '../../hooks/useEditProduct';
import './editProduct.css';

const EditProduct = () => {
    const { beverages, desserts, meals, editProduct, deleteProduct } = useEditProduct();
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(''); // Add this state

    const handleEdit = (category, product) => {
        setEditingProduct({...product});
        setEditingCategory(category);
    };

    const handleSave = () => {
        if (editingProduct && editingCategory) {
            editProduct(editingCategory, {...editingProduct});
        }
        setEditingProduct(null);
        setEditingCategory(null);
    };

    const handleDelete = (category, product) => {
        deleteProduct(category, product);
    };

    const handleCategoryChange = (category) => { // Update this function
        setSelectedCategory(category);
    };

    return (
        <div className="edit-product-container">
            {editingProduct ? (
                <div>
                    <h2>Edit Product</h2>
                    <form>
                        <label>
                            Name:
                            <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                        </label>
                        <label>
                            Image URL:
                            <input type="text" value={editingProduct.imageUrl} onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})} />
                        </label>
                        <label>
                            Ingredients:
                            <input type="text" value={editingProduct.ingredients} onChange={(e) => setEditingProduct({...editingProduct, ingredients: e.target.value})} />
                        </label>
                        <label>
                            Price:
                            <input type="text" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
                        </label>
                        <button type="button" onClick={handleSave}>Save</button>
                    </form>
                </div>
            ) : (
                <>
                    <h2>Select Category:</h2>
                    <div> {/* Add this div */}
                        {['beverages', 'desserts', 'meals'].map((category, index) => (
                            <button key={index} onClick={() => handleCategoryChange(category)}>
                                {category}
                            </button>
                        ))}
                    </div>
                    {selectedCategory && ( // Only show the table if a category is selected
                        <>
                            <h2>{selectedCategory}</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    {/* Change this from "Image URL" to "Image" */}
                                    <th>Ingredients</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(selectedCategory === 'beverages' ? beverages : selectedCategory === 'desserts' ? desserts : meals).map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>
                                            {/* Add this to display the image */}
                                            <img src={product.imageUrl} alt={product.name}
                                                 style={{width: '50px', height: '50px'}}/>
                                        </td>
                                        <td>{product.ingredients}</td>
                                        <td>{product.price}</td>
                                        <td>
                                            <button onClick={() => handleEdit(selectedCategory, product)}>Edit</button>
                                            <button onClick={() => handleDelete(selectedCategory, product)}>Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default EditProduct;
