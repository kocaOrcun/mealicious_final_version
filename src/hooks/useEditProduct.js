import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useEditProduct = () => {
    const [beverages, setBeverages] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [meals, setMeals] = useState([]);
    const db = firebase.firestore();

    const fetchProducts = async () => {
        const beveragesDoc = await db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc('beverages').get();
        const dessertsDoc = await db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc('desserts').get();
        const mealsDoc = await db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc('meals').get();

        setBeverages(beveragesDoc.data().items);
        setDesserts(dessertsDoc.data().items);
        setMeals(mealsDoc.data().items);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const editProduct = async (category, updatedProduct) => {
        const productRef = db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc(category);

        const doc = await productRef.get();
        if (doc.exists) {
            let products = doc.data().items;

            // Güncellenmek istenen ürünün indexini bul
            let productIndex = products.findIndex((p) => p.id === updatedProduct.id);

            if (productIndex !== -1) {
                // Güncelleme işlemi
                let updatedProducts = [...products];
                updatedProducts[productIndex] = updatedProduct;

                await productRef.update({ items: updatedProducts });
                await fetchProducts();
            }
        }
    };

    const deleteProduct = async (category, product) => {
        const productRef = db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc(category);

        const doc = await productRef.get();
        if (doc.exists) {
            let products = doc.data().items;
            products = products.filter((p) => p.id !== product.id);
            await productRef.update({ items: products });
            await fetchProducts(); // Update the product list after deleting
        }
    };

    return { beverages, desserts, meals, editProduct, deleteProduct, fetchProducts };
};

export default useEditProduct;