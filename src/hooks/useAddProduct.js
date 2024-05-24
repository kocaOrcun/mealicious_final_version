// useAddProduct.js
import { useState, useContext } from 'react';
import firebase from "firebase";
import { AuthContext } from '../context/AuthContext';
import toast from "react-hot-toast";

const useAddProduct = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('beverages');
    const db = firebase.firestore();

    const addProduct = async () => {
        if (!user) {
            toast.error("Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.");
            return;
        }

        try {
            const categoryRef = db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc(category);

            const newProduct = {
                name,
                description,
                imageUrl,
                ingredients,
                price: Number(price)
            };

            const doc = await categoryRef.get();

            if (!doc.exists) {
                await categoryRef.set({ items: [newProduct] });
            } else {
                await categoryRef.update({
                    items: firebase.firestore.FieldValue.arrayUnion(newProduct)
                });
            }

            setName('');
            setDescription('');
            setImageUrl('');
            setIngredients('');
            setPrice(0);
            setCategory('beverages');
        } catch (error) {
            console.error("Ürün eklenirken bir hata oluştu: ", error);
        }
    };

    return { addProduct, setName, setDescription, setImageUrl, setIngredients, setPrice, setCategory };
};

export default useAddProduct;