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
    const [price, setPrice] = useState(0); // Başlangıç değerini 0 olarak ayarla
    const [category, setCategory] = useState('beverages');
    const db = firebase.firestore();

    const addProduct = async () => {
        if (!user) {
            toast.error("Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.");
            return;
        }

        console.log("addProduct fonksiyonu çağrıldı");

        try {
            const categoryRef = db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc(category);

            const newProduct = {
                name,
                description,
                imageUrl,
                ingredients,
                price: Number(price) // price değerini number'a çevir
            };

            const doc = await categoryRef.get();

            if (!doc.exists) {
                await categoryRef.set({ items: [newProduct] });
            } else {
                await categoryRef.update({
                    items: firebase.firestore.FieldValue.arrayUnion(newProduct)
                });
            }

            console.log("Ürün başarıyla eklendi");

            setName('');
            setDescription('');
            setImageUrl('');
            setIngredients('');
            setPrice(0); // Başarıyla eklendiğinde price'ı 0'a sıfırla
            setCategory('beverages');
        } catch (error) {
            console.error("Ürün eklenirken bir hata oluştu: ", error);
        }

        console.log("addProduct fonksiyonu tamamlandı");
    };

    return { addProduct, setName, setDescription, setImageUrl, setIngredients, setPrice, setCategory };
};

export default useAddProduct;