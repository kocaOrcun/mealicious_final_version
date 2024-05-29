import  { useState, useEffect } from "react";
import firebase from "firebase";

const useEditProduct = () => {
    const [beverages, setBeverages] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [meals, setMeals] = useState([]);
    const db = firebase.firestore();
    const storage = firebase.storage();

    const fetchProducts = async () => {
        const beveragesDoc = await db
            .collection("restaurant")
            .doc("001")
            .collection("menus")
            .doc("en")
            .collection("categories")
            .doc("beverages")
            .get();
        const dessertsDoc = await db
            .collection("restaurant")
            .doc("001")
            .collection("menus")
            .doc("en")
            .collection("categories")
            .doc("desserts")
            .get();
        const mealsDoc = await db
            .collection("restaurant")
            .doc("001")
            .collection("menus")
            .doc("en")
            .collection("categories")
            .doc("meals")
            .get();

        setBeverages(beveragesDoc.data().items);
        setDesserts(dessertsDoc.data().items);
        setMeals(mealsDoc.data().items);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const editProduct = async (category, updatedProduct, file) => {
        const productRef = db
            .collection("restaurant")
            .doc("001")
            .collection("menus")
            .doc("en")
            .collection("categories")
            .doc(category);

        const doc = await productRef.get();
        if (doc.exists) {
            let products = doc.data().items;

            // Güncellenmek istenen ürünü bul
            let productToUpdate = products.find(
                (p) => p.productID === updatedProduct.productID
            );

            if (productToUpdate) {
                // Eğer yeni bir dosya varsa
                if (file) {
                    const storageRef = storage.ref();
                    const categoryRef = storageRef.child(`${category}/${file.name}`);
                    await categoryRef.put(file);
                    const downloadURL = await categoryRef.getDownloadURL();
                    updatedProduct.imageUrl = downloadURL;
                }

                // Ürün bilgilerini güncelle
                Object.assign(productToUpdate, updatedProduct);

                // Firestore'a güncellenmiş ürün bilgilerini ve yeni resmi kaydet
                await productRef.update({ items: products });
                await fetchProducts();
            }
        }
    };

    const deleteProduct = async (category, product) => {
        const productRef = db
            .collection("restaurant")
            .doc("001")
            .collection("menus")
            .doc("en")
            .collection("categories")
            .doc(category);

        const doc = await productRef.get();
        if (doc.exists) {
            let products = doc.data().items;
            products = products.filter((p) => p.productID !== product.productID);
            await productRef.update({ items: products });
            await fetchProducts(); // Ürün silindikten sonra ürün listesini güncelle

            // Resmi sil
            const imageRef = storage.refFromURL(product.imageUrl);
            await imageRef.delete();
        }
    };

    return {
        beverages,
        desserts,
        meals,
        editProduct,
        deleteProduct,
        fetchProducts,
    };
};

export default useEditProduct;
